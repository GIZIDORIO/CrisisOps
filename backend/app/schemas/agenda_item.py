from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid


class AgendaItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    committee: str  # executive, tactical, area_alignment
    status: str = "pending"
    priority: str = "P2"  # P0, P1, P2, P3
    requester_name: Optional[str] = None
    estimated_duration: Optional[int] = None
    impact: Optional[str] = None
    proposal: Optional[str] = None
    decision_needed: Optional[bool] = False
    item_type: Optional[str] = "action"  # decision, action, diagnosis, project, routine, risk, idea, closure
    suggested_owner: Optional[str] = None
    evidence: Optional[str] = None
    next_step: Optional[str] = None


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
    impact: Optional[str] = None
    proposal: Optional[str] = None
    decision_needed: Optional[bool] = None
    item_type: Optional[str] = None
    suggested_owner: Optional[str] = None
    evidence: Optional[str] = None
    next_step: Optional[str] = None


class AgendaItemOut(AgendaItemBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True
