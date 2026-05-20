from pydantic import BaseModel
from typing import List, Optional
from .work_front import WorkFrontOut
from .task import TaskOut


class TaskStats(BaseModel):
    total: int
    completed: int
    in_progress: int
    pending: int
    blocked: int
    overdue: int


class WorkFrontStats(BaseModel):
    total: int
    on_track: int
    at_risk: int
    critical: int
    completed: int


class DashboardKPIs(BaseModel):
    task_stats: TaskStats
    work_front_stats: WorkFrontStats
    work_fronts: List[WorkFrontOut]
    recent_tasks: List[TaskOut]
    upcoming_meetings: int
    agenda_pending: int
