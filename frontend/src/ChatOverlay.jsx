import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function ChatOverlay({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: `Hi ${user.name}! I am your AI Assistant.` }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage = async () => {
        if (!inputText.trim()) return;

        const newMessages = [...messages, { sender: 'user', text: inputText }];
        setMessages(newMessages);
        setInputText('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/api/v1/chat', {
                user_id: user.name,
                user_role: user.role,
                message: inputText
            });

            setMessages([...newMessages, { sender: 'bot', text: response.data.response }]);
        } catch (error) {
            setMessages([...newMessages, { sender: 'bot', text: "Error connecting to AI server." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-overlay-wrapper">
            {/* Floating Action Button (FAB) */}
            <button className={`fab-button ${isOpen ? 'active' : ''}`} onClick={toggleChat}>
                {isOpen ? '❌' : '🤖'}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header-bar">
                        <span>AI Assistant</span>
                        <span className="status-dot"></span>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-bubble ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isLoading && <div className="chat-bubble bot typing">Typing...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-bar">
                        <input
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Ask anything..."
                            autoFocus
                        />
                        <button onClick={sendMessage}>➤</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatOverlay;
