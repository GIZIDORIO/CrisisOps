from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import get_settings
from .database import engine, Base
from .api.routes import auth, dashboard, work_fronts, tasks, agenda, meetings, minutes

settings = get_settings()

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CrisisOps API",
    description="Crisis Committee Governance System",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(work_fronts.router, prefix="/api/v1")
app.include_router(tasks.router, prefix="/api/v1")
app.include_router(agenda.router, prefix="/api/v1")
app.include_router(meetings.router, prefix="/api/v1")
app.include_router(minutes.router, prefix="/api/v1")


@app.get("/health")
async def health():
    return {"status": "ok", "app": settings.app_name}
