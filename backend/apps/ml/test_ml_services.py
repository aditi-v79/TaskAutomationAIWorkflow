# test_ml_service.py
import os
import asyncio
from apps.ml.services import MLService

# Ensure you set your email credentials in the environment variables if you're testing email functionality
# os.environ["EMAIL_USER"] = "your_email@example.com"
# os.environ["EMAIL_PASSWORD"] = "your_password"

async def main():
    ml_service = MLService()

    # Test summarization
    summarization_config = {
        "input_text": " The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest man-made structure in the world, a title it held for 41 years until the Chrysler Building in New York City was finished in 1930. It was the first structure to reach a height of 300 metres. Due to the addition of a broadcasting aerial at the top of the tower in 1957, it is now taller than the Chrysler Building by 5.2 metres (17 ft). Excluding transmitters, the Eiffel Tower is the second tallest free-standing structure in France after the Millau Viaduct.",
        "max_length": 70,
        "min_length": 5
    }
    try:
        summary = await ml_service.summarize_text(summarization_config)
        print("Summary:", summary)
    except Exception as e:
        print("Error during summarization:", e)

    # Test image classification
    classification_config = {
        "image_url": "https://unsplash.com/photos/black-and-white-cat-lying-on-brown-bamboo-chair-inside-room-gKXKBY-C-Dk",  # Replace with a valid image URL
        "confidence_threshold": 0.5
    }
    try:
        classification_result = await ml_service.classify_image(classification_config)
        print("Classification Result:", classification_result)
    except Exception as e:
        print("Error during image classification:", e)

    # Test web scraping
    scraping_config = {
        "url": "https://en.wikipedia.org/wiki/Ocean",  
        "selectors": ["h1", "p"]  # Example selectors to scrape
    }
    try:
        scraped_data = await ml_service.scrape_web(scraping_config)
        print("Scraped Data:", scraped_data)
    except Exception as e:
        print("Error during web scraping:", e)

    # Test sending email
    email_config = {
        "recipient": "aditivakeel1917@gmail.com",  # Replace with a valid email address
        "subject": "Test Email",
        "body": "This is a test email sent from the MLService."
    }
    try:
        email_status = await ml_service.send_email(email_config)
        print("Email Status:", email_status)
    except Exception as e:
        print("Error during email sending:", e)

if __name__ == "__main__":
    asyncio.run(main())