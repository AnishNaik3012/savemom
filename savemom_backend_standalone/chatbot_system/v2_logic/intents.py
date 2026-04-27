def detect_intent(text: str) -> str:
    """
    Detect user intent from message text
    """
    if not text:
        return "UNKNOWN"

    text = text.lower()
    print(f"DEBUG: Detecting intent for: {text}")

    appointment_keywords = [
        "appointment",
        "book",
        "schedule",
        "doctor visit",
        "checkup",
        "upcoming"
    ]

    maternal_keywords = [
        "pregnancy",
        "pregnant",
        "diet",
        "food",
        "pain",
        "cramps",
        "baby",
        "weeks"
    ]

    report_keywords = [
        "report",
        "medical record",
        "lab results",
        "patient reports",
        "reports",
        "summary",
        "get summary"
    ]

    prescription_keywords = [
        "prescription",
        "medicine list",
        "meds",
        "medicine names",
        "analyze prescription",
        "pills",
        "dosage",
        "manage prescriptions",
        "manage",
        "my prescriptions"
    ]

    if any(keyword in text for keyword in appointment_keywords):
        return "APPOINTMENT"

    if any(keyword in text for keyword in report_keywords):
        return "REPORT"

    if any(keyword in text for keyword in prescription_keywords):
        print("DEBUG: Intent detected as PRESCRIPTION")
        return "PRESCRIPTION"

    if any(keyword in text for keyword in maternal_keywords):
        return "MATERNAL_CARE"

    return "UNKNOWN"
