from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid


class MinuteBase(BaseModel):
    meeting_id: uuid.UUID
    summary: Optional[str] = None
    decisions: Optional[str] = None  # JSON string
    action_items: Optional[str] = None  # JSON string
    next_steps: Optional[str] = None
    approved_by: Optional[str] = None


class MinuteCreate(MinuteBase):
    pass


class MinuteUpdate(BaseModel):
    summary: Optional[str] = None
    decisions: Optional[str] = None
    action_items: Optional[str] = None
    next_steps: Optional[str] = None
    approved_by: Optional[str] = None


class MinuteOut(MinuteBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
