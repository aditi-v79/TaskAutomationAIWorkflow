from transformers import pipeline, AutoModelForSeq2SeqLM, AutoTokenizer
import requests
from bs4 import BeautifulSoup
import smtplib
from email.mime.text import MIMEText
from .models import TaskConfig
import os

class MLService:
   def __init__(self):
       # Summarization
       self.summarizer = pipeline(
           "summarization",
           model="facebook/bart-small-cnn",
           max_length=130,
           min_length=30
       )

       # Image Classification 
       self.classifier = pipeline(
           "image-classification",
           model="google/vit-base-patch16-224-bit",
           top_k=5
       )

   async def summarize_text(self, config):
       summary = self.summarizer(
           config["input_text"],
           max_length=config.get("max_length", 130),
           min_length=config.get("min_length", 30)
       )
       return summary[0]['summary_text']

   async def scrape_web(self, config):
       headers = {'User-Agent': 'Mozilla/5.0'} 
       response = requests.get(config["url"], headers=headers)
       soup = BeautifulSoup(response.text, 'html.parser')
       
       results = {}
       for selector in config["selectors"]:
           elements = soup.select(selector)
           results[selector] = [e.get_text(strip=True) for e in elements]
       return results

   async def classify_image(self, config):
       predictions = self.classifier(
           config["image_url"]
       )
       threshold = config.get("confidence_threshold", 0.5)
       
       return [
           {
               "label": p["label"],
               "confidence": round(p["score"], 3)
           }
           for p in predictions 
           if p["score"] >= threshold
       ]

   async def send_email(self, config):
       msg = MIMEText(config["body"])
       msg["Subject"] = config["subject"]
       msg["To"] = config["recipient"]
       msg["From"] = os.getenv("EMAIL_USER")

       with smtplib.SMTP("smtp.gmail.com", 587) as server:
           server.starttls()
           server.login(
               os.getenv("EMAIL_USER"),
               os.getenv("EMAIL_PASSWORD")
           )
           server.send_message(msg)
           return {"status": "sent"}