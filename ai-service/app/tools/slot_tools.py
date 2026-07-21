import httpx
from datetime import datetime, timedelta
from langchain_core.tools import tool
from app.core.config import settings
from app.core.logging_config import logger
from app.schemas.tool_results import CheckSlotsResult

SLOT_START_HOUR = 10   # 10 AM
SLOT_END_HOUR = 21     # 9 PM
SLOT_INTERVAL_MINUTES = 30


def format_slot_key(dt: datetime) -> str:
    """Matches the frontend's slotDate key format: day_month_year, no zero-padding."""
    return f"{dt.day}_{dt.month}_{dt.year}"


def format_slot_time(dt: datetime) -> str:
    """Matches the frontend's toLocaleTimeString en-US 2-digit format, e.g. '10:00 AM'."""
    return dt.strftime("%I:%M %p").lstrip("0") if dt.strftime("%I")[0] == "0" else dt.strftime("%I:%M %p")


def generate_day_slots(target_date: datetime, is_today: bool) -> list[datetime]:
    """
    Reimplements the frontend's getAvailableSlots() day-generation logic:
    - If the target date is today, start from the next half-hour mark from now.
    - Otherwise, start at 10:00 AM.
    - End at 9:00 PM.
    """
    if is_today:
        now = datetime.now()
        start = now.replace(second=0, microsecond=0)
        minutes_to_add = 30 - (start.minute % 30) if start.minute % 30 != 0 else 30
        start = start + timedelta(minutes=minutes_to_add)
    else:
        start = target_date.replace(hour=SLOT_START_HOUR, minute=0, second=0, microsecond=0)

    end = target_date.replace(hour=SLOT_END_HOUR, minute=0, second=0, microsecond=0)

    slots = []
    current = start
    while current < end:
        slots.append(current)
        current += timedelta(minutes=SLOT_INTERVAL_MINUTES)
    return slots


@tool
async def check_slots(doctor_id: str, date: str) -> CheckSlotsResult:
    """
    Check available appointment time slots for a specific doctor on a specific date.
    doctor_id must be a real doctor ID (usually obtained from a previous search_doctors call).
    date must be in ISO format: YYYY-MM-DD.
    Use this only after you already know which doctor the patient wants — if you don't have
    a doctor_id yet, call search_doctors first.
    """
    try:
        target_date = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        return CheckSlotsResult(
            success=False, doctor_id=doctor_id, date=date,
            available_slots=[], message="Invalid date format. Expected YYYY-MM-DD."
        )

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{settings.node_api_base_url}/api/doctor/list")
            response.raise_for_status()
            data = response.json()
    except httpx.HTTPError as e:
        logger.error(f"check_slots: failed to reach Node backend: {str(e)}")
        return CheckSlotsResult(
            success=False, doctor_id=doctor_id, date=date,
            available_slots=[], message="Could not reach the doctor directory right now."
        )

    doctor = next((d for d in data.get("doctors", []) if d.get("_id") == doctor_id), None)
    if not doctor:
        return CheckSlotsResult(
            success=False, doctor_id=doctor_id, date=date,
            available_slots=[], message="Doctor not found."
        )

    if not doctor.get("available", False):
        return CheckSlotsResult(
            success=False, doctor_id=doctor_id, doctor_name=doctor.get("name"), date=date,
            available_slots=[], message=f"{doctor.get('name')} is not currently accepting appointments."
        )

    is_today = target_date.date() == datetime.now().date()
    theoretical_slots = generate_day_slots(target_date, is_today)

    slots_booked = doctor.get("slots_booked", {})
    booked_key = format_slot_key(target_date)
    booked_times = set(slots_booked.get(booked_key, []))

    available = [
        format_slot_time(slot) for slot in theoretical_slots
        if format_slot_time(slot) not in booked_times
    ]

    logger.info(f"check_slots: doctor={doctor_id} date={date} -> {len(available)} available slot(s)")

    return CheckSlotsResult(
        success=True,
        doctor_id=doctor_id,
        doctor_name=doctor.get("name"),
        date=date,
        available_slots=available,
        message=None if available else "No slots available on this date."
    )