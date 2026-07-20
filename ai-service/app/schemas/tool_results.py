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