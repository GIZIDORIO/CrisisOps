from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid


class UserBase(BaseModel):
    email: EmailStr
    name: str
    avatar_url: Optional[str] = None
    role: str = "member"


class UserCreate(UserBase):
    google_id: Optional[str] = None


class UserOut(UserBase):
    id: uuid.UUID
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
