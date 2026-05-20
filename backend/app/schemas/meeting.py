from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid


class MeetingBase(BaseModel):
    title: str
    committee: str
    scheduled_at: datetime
    location: Optional[str] = None
    attendees: Optional[str] = None  # JSON string
    status: str = "scheduled"


class MeetingCreate(MeetingBase):
    pass


class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    committee: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    location: Optional[str] = None
    attendees: Optional[str] = None
    status: Optional[str] = None


class MeetingOut(MeetingBase):
    id: uuid.UUID
    created_by: Optional[uuid.UUID] = None
    created_at: datetime

    class Config:
        from_attributes = True
