# SaveMom Chatbot System

This is a fully integrated, persistent version of the SaveMom Chatbot ecosystem, designed for maternal care and medical report analysis.

## 🚀 Recent Upgrades
- **Full Persistence**: Data is saved to `savemom.db` (SQLite) using SQLAlchemy.
- **Hybrid RAG Implementation**: Upgraded from standard LLM to a **Retrieval-Augmented Generation** architecture. The bot provides personalized advice based on user history and medical reports.
- **Authentication**: Real OTP-based login (Flow: `Send OTP` -> `Verify OTP` -> `JWT Token`).
- **Appointments**: Full CRUD system to Book and View appointments, linked to the database.
- **Auto-Indexing Pipeline**: Findings from uploaded medical reports (PDF/Image) are automatically indexed for RAG retrieval.

## 📂 Project Structure
- `main.py`: **Backend Entry Point**. Runs the FastAPI server (`http://localhost:8001`).
- `app/`: **Frontend**. A Next.js application (`http://localhost:3000`).
- `chatbot_system/`: **Logic Core**. Contains Agents, Intents, and Role-Based Modules.
- `appointments/` & `auth/`: **Modules**. Dedicated backend logic for these features.
- `savemom.db`: **Database**. The SQLite file where all data lives.
- `.env.local`: **Secrets**. Contains API keys and environment variables.

## 🛠️ How to Run

### 1. Backend (Python/FastAPI)
```bash
# Install requirements
pip install -r requirements.txt

# Run the server
python main.py
```
*Server runs at: `http://localhost:8001`*

### 2. Frontend (Node/Next.js)
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
*App runs at: `http://localhost:3000`*

## 🔐 Credentials & Security
- **OTP**: Use `123456` for any phone number (Dev Mode).
- **API Key**: All Hybrid RAG requests must include the header: `X-API-KEY: savemom-dev-123`.

## 🧠 Hybrid RAG System
The system uses Google Gemini-1.5-Flash with a searchable knowledge base.

### The Hybrid Ask Endpoint
**URL**: `POST /rag/ask`
**Payload**:
```json
{
  "query": "What was my heart rate in the last report?",
  "use_rag": true
}
```
**Logic**:
1. If `use_rag` is `true`, the system scans medical history.
2. If context is found (e.g., hemoglobin result, fetal heart rate), it provides a data-backed answer.
3. If no context is found, it uses general medical knowledge.

### Status Check
Verify system status and knowledge base size via:
`GET /rag/status` (Header required)

## 🛠️ Technical Stack
- **Backend**: FastAPI (Python)
- **Frontend**: Next.js (React/TypeScript)
- **AI Model**: Google Gemini-1.5-Flash
- **Database**: SQLite (SQLAlchemy)
- **Search**: Vector-ready keyword matching
