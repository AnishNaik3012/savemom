from .core import ChatbotEngine
from .repository import SqlAlchemyChatRepository
from .modules.base import BasicChatModule
from .modules.roles import MotherHealthModule, DoctorAssistantModule, LabWorkerModule

class ChatbotFactory:
    """
    Factory to create the appropriate Chatbot Engine based on the User's Role.
    This fulfills the requirement of 'Separate Architectures/Models' for different users.
    """
    
    @staticmethod
    def get_engine_for_user(user_role: str, db_session=None) -> ChatbotEngine:
        """
        Returns a ChatbotEngine configured with a specific pipeline of modules
        tailored to the user.
        """
        repo = SqlAlchemyChatRepository(db_session)
        modules = []
        
        # 1. Common Modules (Everyone gets basic chitchat)
        modules.append(BasicChatModule())
        
        # 2. Role-Specific Modules
        if user_role.lower() == 'mother':
            # Mother's "Model"
            modules.append(MotherHealthModule())
            
        elif user_role.lower() == 'doctor':
            # Doctor's "Model"
            modules.append(DoctorAssistantModule())
            
        elif user_role.lower() in ['lab', 'labworker']:
            # Lab's "Model"
            modules.append(LabWorkerModule())
            
        else:
            # Fallback for unknown or generic users
            # Maybe a GenericHealthModule?
            pass
            
        return ChatbotEngine(modules, repo)
