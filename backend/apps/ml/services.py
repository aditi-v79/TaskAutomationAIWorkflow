from transformers import pipeline, AutoModelForSeq2SeqLM, AutoTokenizer, AutoImageProcessor, AutoModelForImageClassification
import requests
from bs4 import BeautifulSoup
import smtplib
from email.mime.text import MIMEText
from .models import TaskConfig
import os

class MLService:
    def __init__(self):
        self.summarizer = pipeline(
            "summarization",
            model="facebook/bart-large-cnn",
            max_length=130,
            min_length=30
        )
        self.classifier = pipeline(
            "image-classification",
            model="google/vit-base-patch16-224",
            top_k=5
        )

    async def scrape_web(self, config):
        try:
            headers = {'User-Agent': 'Mozilla/5.0'} 
            response = requests.get(config["url"], headers=headers)
            response.raise_for_status()  # Raise exception for bad status codes
            
            soup = BeautifulSoup(response.text, 'html.parser')
            results = {}
            for selector in config["selectors"]:
                elements = soup.select(selector)
                results[selector] = [e.get_text(strip=True) for e in elements]
            return results
        except requests.RequestException as e:
            raise Exception(f"Scraping failed: {str(e)}")

    async def summarize_text(self, config):
        try:
            if not config.get("input_text"):
                raise ValueError("Input text is required")
                
            summary = self.summarizer(
                config["input_text"],
                max_length=config.get("max_length", 130),
                min_length=config.get("min_length", 30)
            )
            return summary[0]['summary_text']
        except Exception as e:
            raise Exception(f"Summarization failed: {str(e)}")

    async def classify_image(self, config):
        try:
            if not config.get("image_url"):
                raise ValueError("Image URL is required")
                
            predictions = self.classifier(config["image_url"])
            threshold = config.get("confidence_threshold", 0.5)
            
            return [
                {
                    "label": p["label"],
                    "confidence": round(p["score"], 3)
                }
                for p in predictions 
                if p["score"] >= threshold
            ]
        except Exception as e:
            raise Exception(f"Classification failed: {str(e)}")


    async def send_email(self, config):
       msg = MIMEText(config["body"])
       msg["Subject"] = config["subject"]
       msg["To"] = config["recipient"]
       msg["From"] = os.getenv("EMAIL_USER")

       with smtplib.SMTP("smtp.gmail.com", 587) as server:
           server.starttls()
        #    server.login(
        #        os.getenv("EMAIL_USER"),
        #        os.getenv("EMAIL_PASSWORD")
        #    )
           server.login("xx@gmail.com", "xxx")
           server.send_message(msg)
           return {"status": "sent"}