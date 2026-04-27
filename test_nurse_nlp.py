import sys
import os

# Add current directory to path so we can import nurse module
sys.path.append(os.path.abspath(os.curdir))

from nurse.nlp import nlp_service

def test_nlp():
    print("Testing Nurse NLP Service...")
    
    test_cases = [
        "I need to log patient vitals for bed 4",
        "Handing over the shift to the night nurse",
        "Patient in room 202 is having severe pain, need a doctor",
        "Administering Amoxicillin 500mg"
    ]
    
    for text in test_cases:
        intent, confidence = nlp_service.predict_intent(text)
        print(f"\nText: {text}")
        print(f"Predicted Intent: {intent}")
        print(f"Confidence: {confidence:.4f}")

if __name__ == "__main__":
    try:
        test_nlp()
    except Exception as e:
        print(f"Test failed: {e}")
