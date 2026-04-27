import os
import google.generativeai as genai
from typing import List, Dict, Any, Optional

class RAGService:
    _knowledge_base: List[Dict[str, Any]] = []

    @classmethod
    def index_report(cls, report_data: Dict[str, Any]):
        cls._knowledge_base.append(report_data)

    @classmethod
    def retrieve_context(cls, query: str, limit: int = 3) -> str:
        query_lower = query.lower()
        results = []
        
        for item in cls._knowledge_base:
            content_to_check = f"{item.get('report_title', '')} {item.get('summary', '')} {item.get('description', '')}".lower()
            if any(word in content_to_check for word in query_lower.split()):
                results.append(item)
        
        if not results:
            return ""

        context_blocks = []
        for res in results[:limit]:
            block = f"Report: {res.get('report_title')}\nSummary: {res.get('summary')}\nDetails: {res.get('description')}"
            context_blocks.append(block)
            
        return "\n\n---\n\n".join(context_blocks)

    @staticmethod
    async def generate_hybrid_response(query: str, context: Optional[str] = None) -> str:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return "Configuration Error: API Key missing."

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-flash-latest')

        if context:
            prompt = f"Using the clinical context below, answer accurately. CONTEXT: {context} USER QUESTION: {query}"
        else:
            prompt = f"User Question: {query}"

        try:
            response = await model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            return f"Service Error: {str(e)}"

    @staticmethod
    async def generate_wellness_insight(patient_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return {"error": "Configuration Error: API Key missing."}

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-flash-latest')

        prompt = """
        You are a maternal health expert assistant for SaveMom.
        Generate a personalized health insight and a 'Wellness Score' (1-100) for a pregnant mother.
        Data: {data}
        Return a JSON object with:
        - "insight": A warm, encouraging, and medically sound piece of advice (max 2 sentences).
        - "score": An integer from 1-100 representing general wellness based on data provided.
        - "category": One word (e.g., 'Nutrition', 'Activity', 'Hydration').
        If no data is provided, assume a generic healthy profile but give a relevant tip.
        """.format(data=patient_data or "Generic healthy profile")

        try:
            response = await model.generate_content_async(prompt)
            # Simple cleanup for JSON parsing if needed, but for now just extract text
            text = response.text
            # Basic parsing (could be improved with a proper JSON parser)
            import json
            import re
            
            # Find JSON-like block
            match = re.search(r'\{.*\}', text, re.DOTALL)
            if match:
                return json.loads(match.group())
            
            return {
                "insight": text if len(text) < 100 else "Stay hydrated and take your prenatal vitamins daily.",
                "score": 85,
                "category": "General"
            }
        except Exception as e:
            return {"error": f"Service Error: {str(e)}", "score": 0}

rag_service = RAGService()
