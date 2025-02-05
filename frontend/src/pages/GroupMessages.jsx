import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import Card from '../Components/Card';
import { Button } from '@nextui-org/react';
import { Link, useNavigate } from 'react-router-dom';
import { verify } from '../features/authentication/AuthSlice';
import { useDispatch } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import { FaRegSmile } from "react-icons/fa";

const GroupChat = () => {
    const { id } = useParams();
    const { user } = useSelector((state) => state.auth);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const { access } = useSelector((state) => state.auth);
    const [groupChat, setGroupChat] = useState(null);
    const messagesEndRef = useRef(null);
    const [realTimeMessages, setRealTimeMessages] = useState([]);
    const { profile } = useSelector((state) => state.profile);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const emojiPickerRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const handleEmojiShow = () => {
      setShowEmojiPicker(!showEmojiPicker);
    };
    const handleEmojiSelected = (emoji) => {
      setMessage(message + emoji.emoji);
       setShowEmojiPicker(false);
    };
    const parseMessage = (message) => {
        const urlPattern = /(https?:\/\/[^\s]+)/g;
        return message.split(" ").map((word, index) => {
          if (urlPattern.test(word)) {
            return (
              <a key={index} href={word} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                {word}
              </a>
            );
          }
          return word + " ";
        });
      };
    //verify user at regular interval
    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(verify());
        }, 1000 * 60 * 4); // 4 minutes
        return () => clearInterval(interval);
    }, [dispatch]);

    const fetchMessages = () => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chat/group-chats/${id}/`, {
            headers: {
                'Authorization': `Bearer ${access}`
            }
        })
        .then((res) => {
            setGroupChat(res.data);
            console.log(res.data?.group_chat?.users,"groupChat")
            const isMember = res.data?.group_chat?.users.some(groupUser => groupUser.id === user?.pk);
            console.log(isMember, "isMember");
            console.log(user?.pk, "user?.pk");
            if(!isMember){
                //redirect to group chats page
                navigate('/group-chat');
            }
            setMessages(res.data.messages); // Load old chats
        })
        .catch(error => console.error("Error fetching messages:", error));
    };

    useEffect(() => {
        fetchMessages();
       
    }, [id, access]);

    const { sendJsonMessage, lastJsonMessage } = useWebSocket(`wss://13.60.84.189/ws/group-chat/${id}/?token=${access}`, {
        queryParams: {
            user_id: user?.pk,
        },
        onOpen: () => console.log('WebSocket connection opened'),
        onClose: () => console.log('WebSocket connection closed'),
        onError: (error) => console.log('WebSocket error:', error),
        shouldReconnect: (closeEvent) => true,
    });

    useEffect(() => {
        if (lastJsonMessage) {
            const newMessage = {
                id: lastJsonMessage.id || Date.now(),
                message: lastJsonMessage.body,
                user: lastJsonMessage.user === profile.username ? profile : { username: lastJsonMessage.user },
                created_at: lastJsonMessage.created_at || new Date().toISOString(),
            };
            setRealTimeMessages((prevMessages) => [...prevMessages, newMessage]);
        }
    }, [lastJsonMessage]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() === '') return;

        sendJsonMessage({
            event: 'send_message',
            data: {
                message,
                group_id: id,
            },
        });
        setMessage('');  // Clear input after sending
        scrollToBottom(); // Scroll to bottom after sending a message
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom(); // Scroll to bottom when messages are fetched
    }, [messages]);

    useEffect(() => {
        scrollToBottom(); // Scroll to bottom when new real-time messages are received
    }, [realTimeMessages]);

    return (
        <Card>
            <div className="container mx-auto p-4">
          
                <h1 className="text-3xl font-bold mb-6 border-b pb-4 capitalize "> {groupChat?.group_chat.name}</h1>
                {groupChat?.group_chat?.admins.length > 0 ? (
                    <div className='flex gap-3 flex-col'>
                  <p className="text-gray-700">
                    Admin: {groupChat.group_chat.admins.map((admin) => admin.user.username).join(', ')}
                  </p>
                  <Button
                  className=" mx-auto hidden w-fit items-center gap-2 self-start rounded-2xl border-b-4 border-blue-500 bg-blue-400 px-5 py-6 font-bold uppercase text-white transition hover:brightness-110 md:flex"
                  variant='bordered'
                  as={Link}
                  to={`/group-chat/${id}/settings`}
                  >Group Details</Button>
                  </div>
                ) : (
                  <p>
                   
                  </p>
                )}
                
              
                {/* Messages List */}
                <div className="bg-gray-100 p-4 rounded h-96 overflow-y-auto mb-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-start mb-2 ${msg.user.id === user?.pk ? 'justify-end' : ''}`}>
                            <div>
                                <div className={`p-2 rounded-lg ${msg.user.id !== user?.pk ? 'bg-green-400 text-white rounded-tl-none' : 'bg-gray-300 text-black rounded-tr-none'}`}>

                                    <strong>{msg.user.username}: </strong><br/> {parseMessage(msg.message)}
                                </div>
                                <span className="text-xs text-gray-500">{moment(msg.created_at).format('hh:mm A')}</span>
                            </div>
                        </div>
                    ))}
                    {realTimeMessages.map((msg) => (
                        <div key={msg.id} className={`flex items-start mb-2 ${msg.user.username === profile.username ? 'justify-end' : ''}`}>
                            <div>   
                                <div className={`p-2 rounded-lg ${profile.username !== msg.user.username ? 'bg-green-400 text-white rounded-tl-none'  : 'bg-gray-300 text-black rounded-tr-none'}`}>
                                    <strong>{msg.user.username}: </strong><br/> {parseMessage(msg.message)}
                                </div>
                                <span className="text-xs text-gray-500">{moment(msg.created_at).format('hh:mm A')}</span>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow border p-2 rounded"
                    />
                       {showEmojiPicker && (
          <div 
            ref={emojiPickerRef} 
            className="absolute top-[31vh] right-[17vw] z-10"
            style={{ width: '300px' }}
          >
            <EmojiPicker onEmojiClick={handleEmojiSelected} />
          </div>
        )}
         <div className=' cursor-pointer' onClick={handleEmojiShow} ><FaRegSmile className='size-6' /></div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
                </form>
            </div>
        </Card>
    );
};

export default GroupChat;
