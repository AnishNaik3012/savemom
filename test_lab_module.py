from chatbot_system.v2_logic.intents import detect_intent
from chatbot_system.modules.v2_module import V2ChatModule
from chatbot_system.interfaces import ChatContext

def test_lab_intent():
    messages = [
        "show my lab results",
        "what is my hemoglobin?",
        "check my blood sugar level",
        "latest urine test result",
        "lab investigation reports"
    ]
    
    for msg in messages:
        intent = detect_intent(msg)
        print(f"Message: '{msg}' -> Intent: {intent}")
        assert intent == "LAB"

def test_lab_routing():
    module = V2ChatModule()
    context = ChatContext(
        user_id="test-user",
        user_role="mother",
        message_text="I want to see my lab reports"
    )
    
    response = module.process(context)
    print(f"Routing Response: {response}")
    assert response["type"] == "buttons"
    assert "Lab Assistant" in response["response"]
    assert any(b["label"] == "📋 View Lab History" for b in response["buttons"])

if __name__ == "__main__":
    print("Testing Lab Intent Detection...")
    try:
        test_lab_intent()
        print("✅ Lab Intent Detection Passed")
    except AssertionError as e:
        print("❌ Lab Intent Detection Failed")

    print("\nTesting Lab Agent Routing...")
    try:
        test_lab_routing()
        print("✅ Lab Agent Routing Passed")
    except AssertionError as e:
        print("❌ Lab Agent Routing Failed")
