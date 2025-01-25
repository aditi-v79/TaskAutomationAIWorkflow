# ml/models.py
from dataclasses import dataclass

@dataclass
class TaskConfig:
    SUMMARIZATION = {
        "input_text": str,
        "max_length": int,
        "min_length": int
    }
    
    WEB_SCRAPING = {
        "url": str,
        "selectors": list[str]
    }
    
    IMAGE_CLASSIFICATION = {
        "image_url": str,
        "confidence_threshold": float
    }
    
    EMAIL = {
        "recipient": str,
        "subject": str,
        "body": str
    }

# ml/services.py
from transformers import pipeline
import requests
from bs4 import BeautifulSoup
import smtplib
from email.mime.text import MIMEText
from .models import TaskConfig

class MLService:
    def __init__(self):
        self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
        self.classifier = pipeline("image-classification", model="google/vit-base-patch16-224")

    async def summarize_text(self, config):
        return self.summarizer(config["input_text"], 
                             max_length=config.get("max_length", 130),
                             min_length=config.get("min_length", 30))

    async def scrape_web(self, config):
        response = requests.get(config["url"])
        soup = BeautifulSoup(response.text, "html.parser")
        return [soup.select(selector) for selector in config["selectors"]]
        
    async def classify_image(self, config):
        return self.classifier(config["image_url"])
        
    async def send_email(self, config):
        msg = MIMEText(config["body"])
        msg["Subject"] = config["subject"]
        msg["To"] = config["recipient"]
        
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASSWORD"))
            server.send_message(msg)