from sqlalchemy import Column, String, DateTime, Text, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from ..database import Base


class AgendaItem(Base):
    __tablename__ = "agenda_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text)
    committee = Column(String, nullable=False)  # strategic, operational
    status = Column(String, default="pending")  # pending, discussed, approved, rejected, deferred
    priority = Column(String, default="medium")  # low, medium, high, urgent
    requester_name = Column(String)
    estimated_duration = Column(Integer)  # minutes
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
