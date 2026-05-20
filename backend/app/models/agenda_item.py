from sqlalchemy import Column, String, DateTime, Text, Integer, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from ..database import Base


class AgendaItem(Base):
    __tablename__ = "agenda_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text)
    committee = Column(String, nullable=False)  # executive, tactical, area_alignment
    status = Column(String, default="pending")  # pending, triaging, prioritized, discussed, escalated, approved, rejected, deferred, archived
    priority = Column(String, default="P2")  # P0, P1, P2, P3
    requester_name = Column(String)
    estimated_duration = Column(Integer)  # minutes
    # Governance framework fields
    impact = Column(Text)
    proposal = Column(Text)
    decision_needed = Column(Boolean, default=False)
    item_type = Column(String, default="action")  # decision, action, diagnosis, project, routine, risk, idea, closure
    suggested_owner = Column(String)
    evidence = Column(Text)
    next_step = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
