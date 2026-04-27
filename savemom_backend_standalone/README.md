# SaveMom Standalone Backend

This folder contains the complete backend API and AI logic for the SaveMom project. It is designed as a "plug-and-play" module that can be integrated with any frontend.

## Features
- **FastAPI Backend**: High-performance API routes for chat, appointments, and report analysis.
- **Strict Medical Enforcement**: GEMINI AI logic optimized to process *only* medical documents, rejecting non-medical content.
- **Unsubscribe System**: Integrated unsubscription flow that automatically flags emails as spam for unsubscribed users to meet compliance standards.
- **AI Report Analyzer**: Extracts clinical data and generates professional summaries from medical reports.
- **Role-Based Chatbot**: Specialized agents for Mother, Father, Doctor, and Lab roles.
- **SQLite Database**: Pre-configured database for users, sessions, and unsubscription flags.
- **CORS Support**: Configured to allow cross-origin requests from any frontend for easier integration.

## Setup Instructions

### 1. Prerequisites
- Python 3.9 or higher installed.

### 2. Install Dependencies
It is recommended to use a virtual environment:
```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install required packages
pip install -r requirements.txt
```

### 3. Configure Environment
Create a file named `.env.local` in the current directory and add the following variables:

```ini
# --- AI Configuration ---
GEMINI_API_KEY=your_gemini_api_key_here

# --- Email (SMTP) Configuration ---
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password_here

# --- API Configuration ---
API_BASE_URL=http://localhost:8000
```

> [!NOTE]
> If SMTP settings are missing, the system will fall back to printing OTPs and links to the console for debugging purposes.

### 4. Run the Server
```bash
python main.py
```
The backend will start at `http://localhost:8000`.

## API Documentation
Once the server is running, you can access the interactive API docs at:
- **Swagger UI**: `http://localhost:8000/docs`
- **Redoc**: `http://localhost:8000/redoc`

## Folders & Core Files
- `appointments/`: Appointment management logic.
- `auth/`: OTP, Role-based auth, and **Unsubscribe** routes.
- `chatbot_system/`: AI Engine, **Medical Enforcement** logic, and report analysis.
- `core/`: Core internal utilities.
- `utils/`: Common helpers (Email, PDF generation).
- `data/`: RAG Vector DB storage.
- `presc_hybrid/`: Hybrid RAG model implementation for prescriptions.
- `test_*.py`: Various test scripts for verifying features (Unsubscribe, Gemini connection, etc.).
- `main.py`: Main entry point for the FastAPI server.
- `savemom.db`: SQLite database file.

## Integration Tip
To connect your frontend, ensure you point your API base URL to `http://localhost:8000/api/v1` or the specific module prefixes (e.g., `/auth`, `/chat`).
