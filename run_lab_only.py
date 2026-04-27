from fastapi import FastAPI
import uvicorn
import os
from dotenv import load_dotenv

# Load env vars
load_dotenv()
load_dotenv(".env.local")

from lab.routes import router as lab_router
from db import Base, engine
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="SaveMom Lab Module (Isolated)",
    description="Standalone Laboratory API for testing and development",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include ONLY the lab router
app.include_router(lab_router, prefix="/lab", tags=["Lab"])

# Initialize DB tables for lab
Base.metadata.create_all(bind=engine)

@app.get("/")
def health_check():
    return {
        "status": "ok", 
        "service": "Lab Module (Isolated)",
        "endpoints": {
            "docs": "/docs",
            "lab_types": "/lab/types",
            "lab_history": "/lab/history/{health_id}"
        }
    }

if __name__ == "__main__":
    print("Starting Isolated Lab Module on port 8002...")
    uvicorn.run(app, host="0.0.0.0", port=8002)
