import asyncio
from twikit import Client, TooManyRequests
from datetime import datetime
import csv
import os
from random import randint


COOKIES = {
    "att": "1-YlUf8qSXTcsACIEDyO25FaH7s9yy8GKYCY1iWlRB",
    "auth_token": "0061e02622ded6f30f1de6bed37c6bee5538914c",
    "ct0": "1f0c32b6b7d1e8a25b2763a04d2a19ed2921b1fc74e9fbc564e744a26e23ee73891ad5323903df49eb2630d06f1fe49e0b866b48d20cecf478579fc7b7f7faf62d58822c210193f6e067b2a8148cc3ce",

}

MINIMUM_TWEETS = 20
QUERY = ('("flood" OR "floods" OR "#flood" OR "#floods" OR "earthquake" OR "earthquakes" OR '
         '"#earthquake" OR "#earthquakes" OR "landslide" OR "landslides" OR "#landslide" OR '
         '#"landslides") AND ("Andhra Pradesh" OR "Arunachal Pradesh" OR "Assam" OR "Bihar" OR '
         '"Chhattisgarh" OR "Goa" OR "Gujarat" OR "Haryana" OR "Himachal Pradesh" OR '
         '"Jharkhand" OR "Karnataka" OR "Kerala" OR "Madhya Pradesh" OR "Maharashtra" OR '
         '"Manipur" OR "Meghalaya" OR "Mizoram" OR "Nagaland" OR "Odisha" OR "Punjab" OR '
         '"Rajasthan" OR "Sikkim" OR "Tamil Nadu" OR "Telangana" OR "Uttar Pradesh" OR '
         '"Uttarakhand" OR "West Bengal") lang:en since:2024-09-01 -is:retweet')

async def get_tweets(client, tweets):
    """Get the next batch of tweets or the first batch if none provided."""
    if tweets is None:
        print(f'{datetime.now()} - Getting tweets...')
        tweets = await client.search_tweet(QUERY, product='Top')
    else:
        wait_time = randint(5, 10)
        print(f'{datetime.now()} - Getting next tweets after {wait_time} seconds ...')
        await asyncio.sleep(wait_time)
        tweets = await tweets.next()
    return tweets

async def main():
    """Main function to authenticate and fetch tweets, then save them to CSV."""
    # Create the path within the backend folder
    csv_file_path = os.path.join('backend', 'scripts', 'data', 'tweets.csv')
    
    # Ensure the directory exists
    os.makedirs(os.path.dirname(csv_file_path), exist_ok=True)

    # Initialize the client and set headers
    client = Client(language='en-US')
    client.set_cookies(COOKIES)  # Set the cookies for authentication

    tweet_count = 0
    tweets = None

    with open(csv_file_path, 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['Tweet_count', 'Username', 'Text', 'Created At', 'Retweets', 'Likes'])

        while tweet_count < MINIMUM_TWEETS:
            try:
                tweets = await get_tweets(client, tweets)
            except TooManyRequests as e:
                rate_limit_reset = datetime.fromtimestamp(e.rate_limit_reset)
                print(f'{datetime.now()} - Rate limit reached. Waiting until {rate_limit_reset}')
                wait_time = rate_limit_reset - datetime.now()
                await asyncio.sleep(wait_time.total_seconds())
                continue

            if not tweets:
                print(f'{datetime.now()} - No more tweets found')
                break

            # Loop through the fetched tweets and save them to CSV
            for tweet in tweets:
                tweet_count += 1
                tweet_data = [
                    tweet_count, 
                    tweet.user.name, 
                    tweet.text, 
                    tweet.created_at, 
                    getattr(tweet, 'retweet_count', 0), 
                    getattr(tweet, 'favorite_count', 0)
                ]
                writer.writerow(tweet_data)

            print(f'{datetime.now()} - Got {tweet_count} tweets')

    print(f'{datetime.now()} - Done! Got {tweet_count} tweets')

if __name__ == "__main__":
    asyncio.run(main())
