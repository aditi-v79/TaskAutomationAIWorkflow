from transformers import pipeline
from openai import OpenAI
import os

class MLService:
    def __init__(self):
        self.openai_client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.image_classifier = pipeline("image-classification")
    
    def summarize_text(self, text):
        response = self.openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a text summarization assistant."},
                {"role": "user", "content": f"Please summarize the following text:\n\n{text}"}
            ]
        )
        return response.choices[0].message.content
    
    def classify_image(self, image_url):
        results = self.image_classifier(image_url)
        return results