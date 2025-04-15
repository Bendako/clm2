from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import os

from .auth.clerk import verify_clerk_token, ClerkUser

app = FastAPI(title="LLM Platform API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the LLM Platform API"}

@app.get("/api/health")
def health_check():
    """Public endpoint for health checks"""
    return {"status": "ok"}

@app.get("/api/user/me")
def get_current_user(user: ClerkUser = Depends(verify_clerk_token)):
    """Protected endpoint that returns the current user"""
    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
    }

@app.get("/api/models")
def get_models(user: ClerkUser = Depends(verify_clerk_token)):
    """Protected endpoint that returns available models"""
    # This is just a mock response for now
    return [
        {"id": "model1", "name": "GPT-3.5", "status": "ready"},
        {"id": "model2", "name": "LLaMA-2", "status": "training"},
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 