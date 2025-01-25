# Frontend Build Stage
FROM node:18 as frontend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src/ ./src/
COPY vite.config.ts tsconfig*.json ./
EXPOSE 5173
CMD ["npm", "run", "dev"]

# Backend Stage
FROM python:3.10 as backend
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
