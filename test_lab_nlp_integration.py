import sys
import os

# Ensure the app root is in path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from chatbot_system.v2_logic.intents import detect_intent
from chatbot_system.modules.v2_module import V2ChatModule
from chatbot_system.interfaces import ChatContext

def test_integration():
    test_cases = [
        ("I want to see my blood test results", "view history"),
        ("Can you book a thyroid test for me?", "schedule routine"),
        ("What does a high sugar level mean?", "explain"),
        ("How do I upload my reports?", "Welcome")
    ]
    
    module = V2ChatModule()
    
    print("Testing Lab NLP Integration Flow...")
    for msg, expected_snippet in test_cases:
        context = ChatContext(
            user_id="test-user",
            user_role="mother",
            message_text=msg
        )
        
        # 1. Intent Detection
        intent = detect_intent(msg)
        print(f"\nMessage: '{msg}'")
        print(f"Detected Intent: {intent}")
        
        # 2. Module Processing
        response = module.process(context)
        print(f"Response: {response['response']}")
        
        if any(expected_snippet.lower() in b['label'].lower() or expected_snippet.lower() in response['response'].lower() for b in response.get('buttons', [])) or expected_snippet.lower() in response['response'].lower():
            print("PASSED")
        else:
            print("FAILED (Snippet not found)")

if __name__ == "__main__":
    test_integration()
