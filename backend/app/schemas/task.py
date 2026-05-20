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
    priority: str = "P2"  # P0, P1, P2, P3
    support_team: Optional[str] = None
    evidence: Optional[str] = None
    source_committee: Optional[str] = None  # executive, tactical, area_alignment
    next_step: Optional[str] = None
    impediment: Optional[str] = None


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
    support_team: Optional[str] = None
    evidence: Optional[str] = None
    source_committee: Optional[str] = None
    next_step: Optional[str] = None
    impediment: Optional[str] = None


class TaskOut(TaskBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
