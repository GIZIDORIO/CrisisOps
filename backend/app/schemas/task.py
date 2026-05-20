from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
import uuid


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    owner_name: Optional[str] = None
    owner_id: Optional[uuid.UUID] = None
    work_front_id: Optional[uuid.UUID] = None
    deadline: Optional[date] = None
    status: str = "pending"
    priority: str = "medium"


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    owner_name: Optional[str] = None
    owner_id: Optional[uuid.UUID] = None
    work_front_id: Optional[uuid.UUID] = None
    deadline: Optional[date] = None
    status: Optional[str] = None
    priority: Optional[str] = None


class TaskOut(TaskBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
