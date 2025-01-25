# AI-Powered Workflow Automation Platform

A modern workflow automation platform that leverages AI/ML capabilities for task automation, built with Vue.js and Django.

## Features

- Visual workflow builder with drag-and-drop interface
- AI-powered task automation:
  - Text summarization 
  - Image classification 
  - Data scraping
  - Email automation
- Real-time workflow execution monitoring


## Tech Stack

### Frontend
- Vue.js 3 with Composition API
- TypeScript
- Tailwind CSS
- Pinia for state management
- Vue Router
- Vue Draggable Next

### Backend
- Django REST Framework
- SQLite
- Docker 

### AI/ML and other 
- Hugging face transformers:
   - Text summarization using facebook/bart-large-cnn
   - Image classification using google/vit-base-patch16-224
- BeautifulSoup4 for web scraping
- SMTP for email automation

## Project Structure

```
.
├── frontend/               # Vue.js frontend application
│   ├── src/
│   │   ├── components/    # Reusable Vue components and Page components
│   │   ├── stores/        # Pinia stores
│   │   ├── services/      # Utility functions
│   │   └── types/         # TypeScript definitions
│   └── public/            # Static assets
│
├── backend/               # Django REST Framework backend
│   ├── apps/
│   │   ├── workflows/     # Workflow management
│   │   ├── executions/    # Workflow execution
│   │   └── ml/            # ML services
│   ├── core/              # Core Django settings
│   └── requirements/      # Python dependencies
│
└── data/                  # SQLite database            
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+
- Python 3.10+
- SQLite

### Development Setup
1. Clone the repository
2. Run `docker-compose up --build`
3. Access the application at:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8000

   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/api/docs/

   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.