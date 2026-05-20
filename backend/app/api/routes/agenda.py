from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from ...database import get_db
from ...auth import get_current_user
from ...models.user import User
from ...models.agenda_item import AgendaItem
from ...schemas.agenda_item import AgendaItemOut, AgendaItemCreate, AgendaItemUpdate

router = APIRouter(prefix="/agenda", tags=["agenda"])


@router.get("", response_model=List[AgendaItemOut])
async def list_agenda(
    committee: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(AgendaItem)
    if committee:
        q = q.filter(AgendaItem.committee == committee)
    if status:
        q = q.filter(AgendaItem.status == status)
    return q.order_by(AgendaItem.created_at.desc()).all()


@router.post("", response_model=AgendaItemOut, status_code=201)
async def create_agenda_item(
    data: AgendaItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = AgendaItem(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/{item_id}", response_model=AgendaItemOut)
async def update_agenda_item(
    item_id: uuid.UUID,
    data: AgendaItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = db.query(AgendaItem).filter(AgendaItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Agenda item not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=204)
async def delete_agenda_item(
    item_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = db.query(AgendaItem).filter(AgendaItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Agenda item not found")
    db.delete(item)
    db.commit()
