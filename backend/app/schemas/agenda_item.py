from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid


class AgendaItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    committee: str  # strategic, operational
    status: str = "pending"
    priority: str = "medium"
    requester_name: Optional[str] = None
    estimated_duration: Optional[int] = None


class AgendaItemCreate(AgendaItemBase):
    pass


class AgendaItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    committee: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    requester_name: Optional[str] = None
    estimated_duration: Optional[int] = None


class AgendaItemOut(AgendaItemBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True
