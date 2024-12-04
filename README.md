# AI-Powered Workflow Automation Platform

A modern workflow automation platform that leverages AI/ML capabilities for task automation, built with Vue.js and Django.

## Features

- Visual workflow builder with drag-and-drop interface
- AI-powered task automation:
  - Text summarization using GPT
  - Image classification using YOLO
  - Data scraping
  - Email automation
- Real-time workflow execution monitoring
- Scalable microservices architecture
- Container orchestration with Docker Swarm

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
- PostgreSQL
- Redis for task queues
- Celery for async task processing
- Docker & Docker Swarm
- NGINX for reverse proxy

### AI/ML
- OpenAI GPT for text processing
- YOLO for image classification
- Hugging Face Transformers

## Project Structure

```
.
├── frontend/               # Vue.js frontend application
│   ├── src/
│   │   ├── components/    # Reusable Vue components
│   │   ├── stores/        # Pinia stores
│   │   ├── views/         # Page components
│   │   └── types/         # TypeScript definitions
│   └── public/            # Static assets
│
├── backend/               # Django REST Framework backend
│   ├── apps/
│   │   ├── workflows/     # Workflow management
│   │   ├── executions/    # Workflow execution
│   │   └── ml/           # AI/ML services
│   ├── core/             # Core Django settings
│   └── requirements/     # Python dependencies
│
└── docker/               # Docker configuration
    ├── frontend/         # Frontend container
    ├── backend/          # Backend container
    └── nginx/            # NGINX reverse proxy
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+
- Python 3.10+
- PostgreSQL
- Redis

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/workflow-automation.git
   cd workflow-automation
   ```

2. Start the development environment:
   ```bash
   docker-compose up -d
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Create and activate Python virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements/local.txt
   ```

5. Run database migrations:
   ```bash
   python manage.py migrate
   ```

6. Start the development server:
   ```bash
   python manage.py runserver
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/api/docs/

## Deployment

1. Build Docker images:
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. Initialize Docker Swarm:
   ```bash
   docker swarm init
   ```

3. Deploy the stack:
   ```bash
   docker stack deploy -c docker-compose.prod.yml workflow-platform
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.