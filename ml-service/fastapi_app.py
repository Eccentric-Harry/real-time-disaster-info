from fastapi import FastAPI
from pydantic import BaseModel
from classifier import ml_model  # Import updated classifier

# ✅ This should be present
app = FastAPI()

# Define request model
class TextRequest(BaseModel):
    text: str

@app.post("/classify")
async def classify_text(request: TextRequest):
    result = ml_model.classify(request.text)
    return {
        "text": request.text,
        "category": result["category"],
        "date": result["date"],
        "time": result["time"],
        "sentiment_score": result["sentiment_score"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
