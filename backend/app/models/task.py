from sqlalchemy import Column, String, Date, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from ..database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    owner_name = Column(String)
    work_front_id = Column(UUID(as_uuid=True), ForeignKey("work_fronts.id"), nullable=True)
    deadline = Column(Date)
    status = Column(String, default="pending")  # pending, in_progress, completed, blocked
    priority = Column(String, default="medium")  # low, medium, high, critical
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    owner = relationship("User", back_populates="tasks", foreign_keys=[owner_id])
    work_front = relationship("WorkFront", back_populates="tasks")
