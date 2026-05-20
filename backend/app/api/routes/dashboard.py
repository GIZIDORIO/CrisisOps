from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from ...database import get_db
from ...auth import get_current_user
from ...models.user import User
from ...models.task import Task
from ...models.work_front import WorkFront
from ...models.meeting import Meeting
from ...models.agenda_item import AgendaItem
from ...schemas.dashboard import DashboardKPIs, TaskStats, WorkFrontStats
from ...schemas.work_front import WorkFrontOut
from ...schemas.task import TaskOut

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardKPIs)
async def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    today = date.today()

    # Task stats
    tasks = db.query(Task).all()
    task_stats = TaskStats(
        total=len(tasks),
        completed=sum(1 for t in tasks if t.status == "completed"),
        in_progress=sum(1 for t in tasks if t.status == "in_progress"),
        pending=sum(1 for t in tasks if t.status == "pending"),
        blocked=sum(1 for t in tasks if t.status == "blocked"),
        overdue=sum(1 for t in tasks if t.deadline and t.deadline < today and t.status != "completed"),
    )

    # Work front stats
    work_fronts = db.query(WorkFront).all()
    work_front_stats = WorkFrontStats(
        total=len(work_fronts),
        on_track=sum(1 for w in work_fronts if w.status == "on_track"),
        at_risk=sum(1 for w in work_fronts if w.status == "at_risk"),
        critical=sum(1 for w in work_fronts if w.status == "critical"),
        completed=sum(1 for w in work_fronts if w.status == "completed"),
    )

    # Upcoming meetings (next 7 days)
    from datetime import datetime, timedelta
    now = datetime.utcnow()
    upcoming = db.query(Meeting).filter(
        Meeting.scheduled_at >= now,
        Meeting.scheduled_at <= now + timedelta(days=7),
        Meeting.status == "scheduled"
    ).count()

    # Pending agenda items
    agenda_pending = db.query(AgendaItem).filter(AgendaItem.status == "pending").count()

    # Recent tasks (last 10)
    recent_tasks = db.query(Task).order_by(Task.created_at.desc()).limit(10).all()

    return DashboardKPIs(
        task_stats=task_stats,
        work_front_stats=work_front_stats,
        work_fronts=[WorkFrontOut.from_orm(w) for w in work_fronts],
        recent_tasks=[TaskOut.from_orm(t) for t in recent_tasks],
        upcoming_meetings=upcoming,
        agenda_pending=agenda_pending,
    )
