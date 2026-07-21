from pydantic import BaseModel
from typing import List, Optional


class DoctorResult(BaseModel):
    """A single doctor's public-facing info, as returned to the AI layer."""
    id: str
    name: str
    speciality: str
    degree: str
    experience: str
    fees: float
    available: bool
    image: Optional[str] = None


class SearchDoctorsResult(BaseModel):
    """Result of the search_doctors tool call."""
    success: bool
    count: int
    doctors: List[DoctorResult]
    message: Optional[str] = None

class SlotResult(BaseModel):
    """A single available time slot."""
    date: str        # ISO format, e.g. "2026-07-25"
    time: str        # e.g. "10:00 AM"


class CheckSlotsResult(BaseModel):
    """Result of the check_slots tool call."""
    success: bool
    doctor_id: str
    doctor_name: Optional[str] = None
    date: str
    available_slots: List[str]
    message: Optional[str] = None