from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from ..database import Base


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    committee = Column(String, nullable=False)  # strategic, operational
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    location = Column(String)
    attendees = Column(Text)  # JSON string list
    status = Column(String, default="scheduled")  # scheduled, in_progress, completed, cancelled
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    created_by_user = relationship("User", back_populates="meetings", foreign_keys=[created_by])
    minute = relationship("Minute", back_populates="meeting", uselist=False)
