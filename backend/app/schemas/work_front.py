from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid


class WorkFrontBase(BaseModel):
    name: str
    description: Optional[str] = None
    owner_name: Optional[str] = None
    status: str = "on_track"
    progress: int = 0
    color: str = "#3B82F6"


class WorkFrontCreate(WorkFrontBase):
    pass


class WorkFrontUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    owner_name: Optional[str] = None
    status: Optional[str] = None
    progress: Optional[int] = None
    color: Optional[str] = None


class WorkFrontOut(WorkFrontBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True
