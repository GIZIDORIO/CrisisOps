from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid
from ...database import get_db
from ...auth import get_current_user
from ...models.user import User
from ...models.work_front import WorkFront
from ...schemas.work_front import WorkFrontOut, WorkFrontCreate, WorkFrontUpdate

router = APIRouter(prefix="/work-fronts", tags=["work-fronts"])


@router.get("", response_model=List[WorkFrontOut])
async def list_work_fronts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(WorkFront).order_by(WorkFront.created_at.desc()).all()


@router.post("", response_model=WorkFrontOut, status_code=201)
async def create_work_front(
    data: WorkFrontCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    wf = WorkFront(**data.model_dump())
    db.add(wf)
    db.commit()
    db.refresh(wf)
    return wf


@router.get("/{work_front_id}", response_model=WorkFrontOut)
async def get_work_front(
    work_front_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    wf = db.query(WorkFront).filter(WorkFront.id == work_front_id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Work front not found")
    return wf


@router.patch("/{work_front_id}", response_model=WorkFrontOut)
async def update_work_front(
    work_front_id: uuid.UUID,
    data: WorkFrontUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    wf = db.query(WorkFront).filter(WorkFront.id == work_front_id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Work front not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(wf, field, value)
    db.commit()
    db.refresh(wf)
    return wf


@router.delete("/{work_front_id}", status_code=204)
async def delete_work_front(
    work_front_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    wf = db.query(WorkFront).filter(WorkFront.id == work_front_id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Work front not found")
    db.delete(wf)
    db.commit()
