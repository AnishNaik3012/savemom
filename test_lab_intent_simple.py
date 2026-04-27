from chatbot_system.v2_logic.intents import detect_intent

def test_lab_intent():
    messages = [
        "show my lab results",
        "what is my hemoglobin?",
        "check my blood sugar level",
        "latest urine test result",
        "lab investigation reports"
    ]
    
    print("Testing Lab Intent Detection...")
    success = True
    for msg in messages:
        intent = detect_intent(msg)
        print(f"Message: '{msg}' -> Intent: {intent}")
        if intent != "LAB":
            print(f"❌ Failed for: {msg}")
            success = False
    
    if success:
        print("✅ Lab Intent Detection Passed")
    else:
        print("❌ Lab Intent Detection Failed")

if __name__ == "__main__":
    test_lab_intent()
