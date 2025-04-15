from fastapi import FastAPI

app = FastAPI(title="LLM Platform API")

@app.get("/")
def read_root():
    return {"message": "Welcome to the LLM Platform API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 