from transformers import pipeline
import re
from datetime import datetime

class DisasterClassifier:
    def __init__(self):
        # ✅ Using a sentiment model as an alternative
        self.classifier = pipeline("text-classification", model="nlptown/bert-base-multilingual-uncased-sentiment")
        self.sentiment_analyzer = pipeline("sentiment-analysis")

    def extract_date_time(self, text):
        date_pattern = r"\b(202\d[-/]\d{1,2}[-/]\d{1,2})\b"
        time_pattern = r"\b(\d{1,2}:\d{2}(?:\s?[APap][Mm])?)\b"

        date_match = re.search(date_pattern, text)
        time_match = re.search(time_pattern, text)

        date = date_match.group(0) if date_match else datetime.now().strftime("%Y-%m-%d")
        time = time_match.group(0) if time_match else datetime.now().strftime("%H:%M:%S")

        return date, time

    def classify(self, text):
        category_result = self.classifier(text)
        sentiment_result = self.sentiment_analyzer(text)

        category = self.map_disaster_category(text)  # ✅ Mapping based on keywords
        sentiment_score = sentiment_result[0]["score"]

        date, time = self.extract_date_time(text)

        return {
            "category": category,
            "sentiment_score": sentiment_score,
            "date": date,
            "time": time
        }

    def map_disaster_category(self, text):
        # ✅ Using keywords to map disasters
        disaster_keywords = {
            "earthquake": ["earthquake", "tremor", "seismic", "richter"],
            "flood": ["flood", "heavy rain", "flash flood", "water levels"],
            "wildfire": ["wildfire", "forest fire", "burning", "firefighters"],
            "hurricane": ["hurricane", "cyclone", "storm", "typhoon"],
            "pandemic": ["pandemic", "covid", "virus", "outbreak"]
        }

        for category, keywords in disaster_keywords.items():
            if any(keyword in text.lower() for keyword in keywords):
                return category
        return "unknown"

# ✅ Create an instance of the classifier
ml_model = DisasterClassifier()
