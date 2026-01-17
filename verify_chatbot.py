from chatbot_system.factory import ChatbotFactory

def test_chatbot_flow():
    print("=== Testing Modular Chatbot System ===")

    # Scenario 1: A Mother logs in
    print("\n[Scenario 1]: Mother User")
    role = "mother"
    user_id = "mom_123"
    
    # Factory gives us the "Mother Engine"
    engine = ChatbotFactory.get_engine_for_user(role)
    
    # Interaction
    print("User: Hi")
    resp = engine.handle_message(user_id, role, "Hi")
    print(f"Bot: {resp}")
    
    print("User: I feel dizzy")
    resp = engine.handle_message(user_id, role, "I feel dizzy")
    print(f"Bot: {resp}")


    # Scenario 2: A Doctor logs in
    print("\n[Scenario 2]: Doctor User")
    role = "doctor"
    user_id = "doc_456"
    
    # Factory gives us the "Doctor Engine"
    engine = ChatbotFactory.get_engine_for_user(role)
    
    print("User: prescribed dosage for paracetamol")
    resp = engine.handle_message(user_id, role, "prescribed dosage for paracetamol")
    print(f"Bot: {resp}")

if __name__ == "__main__":
    test_chatbot_flow()
