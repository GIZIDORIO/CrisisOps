from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid
from ...database import get_db
from ...auth import get_current_user
from ...models.user import User
from ...models.minute import Minute
from ...schemas.minute import MinuteOut, MinuteCreate, MinuteUpdate

router = APIRouter(prefix="/minutes", tags=["minutes"])


@router.get("", response_model=List[MinuteOut])
async def list_minutes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Minute).order_by(Minute.created_at.desc()).all()


@router.post("", response_model=MinuteOut, status_code=201)
async def create_minute(
    data: MinuteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    minute = Minute(**data.model_dump())
    db.add(minute)
    db.commit()
    db.refresh(minute)
    return minute


@router.get("/{minute_id}", response_model=MinuteOut)
async def get_minute(minute_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    minute = db.query(Minute).filter(Minute.id == minute_id).first()
    if not minute:
        raise HTTPException(status_code=404, detail="Minute not found")
    return minute


@router.get("/meeting/{meeting_id}", response_model=MinuteOut)
async def get_minute_by_meeting(meeting_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    minute = db.query(Minute).filter(Minute.meeting_id == meeting_id).first()
    if not minute:
        raise HTTPException(status_code=404, detail="Minute not found for this meeting")
    return minute


@router.patch("/{minute_id}", response_model=MinuteOut)
async def update_minute(
    minute_id: uuid.UUID,
    data: MinuteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    minute = db.query(Minute).filter(Minute.id == minute_id).first()
    if not minute:
        raise HTTPException(status_code=404, detail="Minute not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(minute, field, value)
    db.commit()
    db.refresh(minute)
    return minute
