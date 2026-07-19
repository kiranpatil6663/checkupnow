from pydantic import BaseModel, Field
from typing import Optional, Literal

class PatientIntent(BaseModel):
    """Structured representation of what the patient wants, extracted from natural language."""

    intent: Literal[
        "search_doctors",
        "check_slots",
        "book_appointment",
        "cancel_appointment",
        "reschedule_appointment",
        "unclear",
    ] = Field(description="The primary action the patient wants to take")

    specialty: Optional[str] = Field(
        default=None,
        description="Medical specialty mentioned, e.g. Dermatologist, Gynecologist, General physician. Null if not mentioned."
    )

    preferred_timeframe: Optional[str] = Field(
        default=None,
        description="When the patient wants the appointment, in relative terms, e.g. 'today', 'tomorrow', 'next_week'. Null if not mentioned."
    )

    preferred_time_of_day: Optional[Literal["morning", "afternoon", "evening"]] = Field(
        default=None,
        description="Time of day preference, if mentioned. Null otherwise."
    )

    raw_message: str = Field(description="The original patient message, unmodified")