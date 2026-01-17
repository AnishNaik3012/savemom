from ..interfaces import IChatModule, ChatContext

class BasicChatModule(IChatModule):
    """Handles basic greetings and help commands."""
    
    @property
    def name(self):
        return "Basic"

    def can_handle(self, context: ChatContext) -> bool:
        text = context.message_text.lower()
        return text in ["hi", "hello", "help", "start"]

    def process(self, context: ChatContext) -> str:
        role_msg = f" as a {context.user_role}" if context.user_role else ""
        return f"Hello! How can I assist you{role_msg} today?"
