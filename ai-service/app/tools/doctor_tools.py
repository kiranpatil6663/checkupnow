import httpx
from langchain_core.tools import tool
from app.core.config import settings
from app.core.logging_config import logger
from app.schemas.tool_results import DoctorResult, SearchDoctorsResult

# Maps common patient phrasing to your actual DB specialty values
# (from frontend/src/assets/assets.js specialityData / doctorModel speciality field)
SPECIALTY_ALIASES = {
    "skin doctor": "Dermatologist",
    "skin specialist": "Dermatologist",
    "dermatologist": "Dermatologist",
    "child doctor": "Pediatricians",
    "kids doctor": "Pediatricians",
    "pediatrician": "Pediatricians",
    "women's doctor": "Gynecologist",
    "gynecologist": "Gynecologist",
    "brain doctor": "Neurologist",
    "neurologist": "Neurologist",
    "stomach doctor": "Gastroenterologist",
    "gastroenterologist": "Gastroenterologist",
    "general doctor": "General physician",
    "general physician": "General physician",
    "family doctor": "General physician",
}


def normalize_specialty(raw_specialty: str) -> str:
    """
    Maps casual patient phrasing to an actual specialty value in the database.
    Falls back to the original string (title-cased) if no alias matches,
    so partial/unexpected input still attempts a DB match rather than failing silently.
    """
    if not raw_specialty:
        return ""
    key = raw_specialty.strip().lower()
    return SPECIALTY_ALIASES.get(key, raw_specialty.strip())


@tool
async def search_doctors(specialty: str = "", only_available: bool = True) -> SearchDoctorsResult:
    """
    Search for doctors by medical specialty.
    Use this when a patient wants to find or book a doctor of a specific type.
    If specialty is empty, returns all doctors.
    Set only_available to False if the patient explicitly wants to see unavailable doctors too.
    """
    normalized_specialty = normalize_specialty(specialty)

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{settings.node_api_base_url}/api/doctor/list")
            response.raise_for_status()
            data = response.json()
    except httpx.HTTPError as e:
        logger.error(f"search_doctors: failed to reach Node backend: {str(e)}")
        return SearchDoctorsResult(
            success=False, count=0, doctors=[],
            message="Could not reach the doctor directory right now. Please try again shortly."
        )

    if not data.get("success"):
        return SearchDoctorsResult(success=False, count=0, doctors=[], message="Doctor list unavailable.")

    all_doctors = data.get("doctors", [])

    filtered = [
        d for d in all_doctors
        if (not normalized_specialty or d.get("speciality") == normalized_specialty)
        and (not only_available or d.get("available") is True)
    ]

    results = [
        DoctorResult(
            id=d.get("_id"),
            name=d.get("name"),
            speciality=d.get("speciality"),
            degree=d.get("degree"),
            experience=d.get("experience"),
            fees=d.get("fees"),
            available=d.get("available"),
            image=d.get("image"),
        )
        for d in filtered
    ]

    logger.info(f"search_doctors: specialty='{normalized_specialty}' matched {len(results)} doctor(s)")

    return SearchDoctorsResult(
        success=True,
        count=len(results),
        doctors=results,
        message=None if results else f"No available doctors found for '{normalized_specialty or specialty}'."
    )