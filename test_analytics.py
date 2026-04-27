from db import SessionLocal
from model import User, VitalsRecord
from analytics.service import get_health_summary
import uuid

def test_summary():
    db = SessionLocal()
    try:
        user_id_str = "3664c19c-d9ae-4619-a297-74b3f6849c75"
        res = get_health_summary(db, user_id_str)
        print("Success:", res)
    except Exception as e:
        print(f"Exception Message: {repr(e)}")
    db.close()

if __name__ == "__main__":
    test_summary()
