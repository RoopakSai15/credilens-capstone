from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.model_store import load_all
from routers import predict, meta, upload

app = FastAPI(title="Credit Default XAI API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "https://credilens-gamma.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    load_all()


app.include_router(predict.router, prefix="/predict", tags=["Prediction"])
app.include_router(meta.router, prefix="/meta", tags=["Metadata"])
app.include_router(upload.router, prefix="/upload", tags=["CSV Upload"])


@app.get("/")
def root():
    return {"status": "ok", "message": "Credit Default XAI API is running"}
