import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useSelector } from 'react-redux';

const AIChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const { access } = useSelector((state) => state.auth);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Scroll to bottom whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch previous messages when component mounts
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access}`,
                };
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/ai_chatbot/chat-history/`, { headers }
                );
                setMessages(response.data.messages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        fetchMessages();
    }, [access]);

    // Function to handle sending a message
    const sendMessage = async (e) => {
        e.preventDefault();

        if (!input.trim()) return;

        setLoading(true);

        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`,
            };

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/ai_chatbot/chat/`,
                { message: input },
                { headers }
            );

            const newMessage = {
                user_message: input,
                ai_response: response.data.response,
            };

            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setInput('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chatbot flex flex-col h-[90vh] mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
            <div className="bg-blue-600 text-white p-4 flex items-center space-x-4">
                <img 
                    src="https://img.freepik.com/premium-vector/cute-robot-waving-hand-cartoon-character-science-technology-isolated_138676-3155.jpg"
                    alt="AIbot"
                    className="w-16 h-16 rounded-full object-cover" 
                />
                <h2 className="text-xl font-bold">AIbot</h2>
            </div>
            
            <div className="chat-messages flex-1 overflow-y-auto p-4 space-y-4">
                {messages && messages.map((msg, index) => (
                    <div key={index} className="flex flex-col">
                        {/* User Message */}
                        <div className="self-end w-3/4 mb-2">
                            <div className="bg-blue-500 text-white text-end p-3 rounded-lg rounded-tr-none shadow-md">
                                <div className="font-bold text-sm mb-1">You</div>
                                <p>{msg.user_message}</p>
                            </div>
                        </div>
                        
                        {/* AI Response */}
                        <div className="self-start w-3/4 mb-2">
                            <div className="bg-gray-100 text-start text-gray-800 p-3 rounded-lg rounded-tl-none shadow-md">
                                <div className="font-bold text-sm mb-1 text-gray-600">AIbot</div>
                                <ReactMarkdown className="markdown-content">
                                    {msg.ai_response}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
                {/* Invisible element to scroll to */}
                <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={sendMessage} className="chat-input p-4 border-t flex items-center space-x-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={loading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                >
                    {loading ? 'Sending...' : 'Send'}
                </button>
            </form>
        </div>
    );
};

export default AIChatBot;