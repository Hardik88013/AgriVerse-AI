# AgriSense AI - Backend

This is the FastAPI backend for the AgriSense AI platform.

## Features
- **FastAPI**: Modern, fast web framework for building APIs.
- **Motor**: Asynchronous MongoDB driver.
- **Pydantic**: Data validation and settings management.
- **CORS setup**: Ready for React frontend integration.

## Folder Structure
- `routers/`: Contains API endpoints grouped by feature (e.g., users, health).
- `models/`: Database models (Placeholder for future ORM if needed, though we use Schemas primarily).
- `schemas/`: Pydantic validation schemas defining expected inputs and outputs.
- `services/`: Business logic (to keep routers clean).
- `utils/`: Helper functions.
- `middlewares/`: Custom request/response handling.

## Setup Instructions

1. **Create Virtual Environment:**
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   ```

2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Environment Variables:**
   - Copy `.env.example` to a new file named `.env`.
   - Update `MONGODB_URI` with your actual MongoDB Atlas connection string.

4. **Run the Server:**
   ```bash
   uvicorn main:app --reload
   # Or simply:
   python main.py
   ```

5. **View Documentation:**
   Open your browser and navigate to `http://localhost:8000/docs` to see the automatically generated Swagger UI API documentation.

## Testing
- **Backend Testing:** We use FastAPI's built-in Swagger UI (`/docs`) for manual testing. Later, we can add `pytest`.
- **Database Testing:** Use MongoDB Compass to visually inspect your data in the Atlas cluster.
