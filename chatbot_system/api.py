from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Dict

from .factory import ChatbotFactory

router = APIRouter()

# --- Request/Response Models ---
class ChatRequest(BaseModel):
    user_id: str
    user_role: str  # In production, this would be extracted from a JWT token
    message: str

class ChatResponse(BaseModel):
    response: str
    metadata: Optional[Dict] = {}

# --- Dependency Injection for DB (Stub) ---
def get_db_session():
    # In real world: yield SessionLocal()
    return None

# --- Endpoints ---
@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(payload: ChatRequest, db = Depends(get_db_session)):
    """
    Primary Chat Endpoint.
    1. Identifies the user role from the payload (or auth token).
    2. Instantiates the correct Chat Engine via Factory.
    3. Processes the message and returns the response.
    """
    try:
        # 1. Get the Role-Based Engine
        engine = ChatbotFactory.get_engine_for_user(payload.user_role, db)
        
        # 2. Process Message
        bot_response = engine.handle_message(
            user_id=payload.user_id,
            user_role=payload.user_role,
            text=payload.message
        )
        
        return ChatResponse(response=bot_response)

    except Exception as e:
        # Log error in production
        print(f"Error processing chat: {e}")
        raise HTTPException(status_code=500, detail="Internal Chatbot Error")
