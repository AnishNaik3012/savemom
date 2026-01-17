from fastapi import FastAPI
from chatbot_system.api import router as chat_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="SaveMom Chatbot API",
    description="Role-Based Chatbot Backend for Maternal Healthcare",
    version="1.0.0"
)

# Enable CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register/Include the Chat Router
app.include_router(chat_router, prefix="/api/v1", tags=["Chat"])

@app.get("/")
def health_check():
    return {"status": "ok", "service": "SaveMom Chatbot Backend"}

if __name__ == "__main__":
    import uvicorn
    # Run the server
    # Command: python main.py
    print("Starting SaveMom Chatbot Server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
