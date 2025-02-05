import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import useWebSocket from 'react-use-websocket';
import moment from 'moment';
import { motion } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';
import { FaRegSmile } from "react-icons/fa";

const Chats = () => {
  const chatContainerRef = useRef(null);
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
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();
  const [realTimeMessages, setRealTimeMessages] = useState([]);
  const [oldMessages, setOldMessages] = useState([]);
  const user_id = user?.pk;
  const [message, setMessage] = useState('');
  const [convo, setConvo] = useState(null);
  const access = localStorage.getItem('access');

  const conversation = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${id}/`, {
        headers: {
          'Authorization': `Bearer ${access}`
        }
      });
      setConvo(response.data);
      setOldMessages(response.data.messages);
    } catch (error) {
      console.error(error, "this is error");
    }
  };

  useEffect(() => {
    conversation();
  }, [id]);

  const myuser = convo?.conversation?.users?.find((user) => user.id === user_id);
  const otheruser = convo?.conversation?.users?.find((user) => user.id !== user_id);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(`wss://13.60.84.189/ws/${id}/?token=${access}`, {
    share: true,
    shouldReconnect: () => true,
  });

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [oldMessages, realTimeMessages]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendJsonMessage({
      event: "send_message",
      data: {
        body: message,
        name: myuser?.username,
        sent_to_id: otheruser?.id,
        conversation_id: id,
        user: user_id,
      }
    });
    setMessage("");
    scrollToBottom();
  };

  useEffect(() => {
    if (lastJsonMessage?.name && lastJsonMessage?.body) {
      setRealTimeMessages((prev) => [
        ...prev,
        {
          name: lastJsonMessage.name,
          body: lastJsonMessage.body,
          user: user_id,
          timestamp: moment().format('h:mm a'),
        }
      ]);
      scrollToBottom();
    }
  }, [lastJsonMessage]);

  return (
    <div className="flex flex-col h-[90vh] border rounded-lg shadow-lg bg-white">
      {otheruser && (
        <div className="flex items-center p-4 border-b bg-gray-50">
          <img
            src={`${otheruser.profile_picture}`}
            alt={`${otheruser.first_name} ${otheruser.last_name}`}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h2 className="text-lg font-semibold">{`${otheruser.first_name} ${otheruser.last_name}`}</h2>
            <p className="text-sm text-gray-500">@{otheruser.username}</p>
          </div>
        </div>
      )}

      <div
        ref={chatContainerRef}
        className="flex flex-col space-y-4 overflow-y-auto h-full p-4 bg-gray-100"
      >
        {oldMessages.map((message, index) => (
          <motion.div
            key={index}
            className={`flex ${message.created_by.id === myuser?.id ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex-none">
              <div className="font-bold text-sm mb-1">{message.created_by.username}</div>
              <div className={`p-3 rounded-lg text-start ${message.created_by.id !== myuser?.id ? 'bg-green-400 text-white' : 'bg-gray-200 text-gray-800'} px-4 py-2 rounded-3xl ${message.created_by.id !== myuser?.id ? 'rounded-tl-none' : 'rounded-tr-none'}`}>
              <div>{parseMessage(message.body)}</div>
                <div className={`text-xs mt-1 ${message.created_by.id !== myuser?.id ? 'text-blue-200' : 'text-gray-400'}`}>{moment(message.created_at).format('h:mm a')}</div>
              </div>
            </div>
          </motion.div>
        ))}
        {realTimeMessages.map((message, index) => (
          <motion.div
            key={index}
            className={`flex ${message.name === myuser?.username ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex-none">
              <div className="font-bold text-sm mb-1">{message.name}</div>
              <div className={`p-3 rounded-lg text-start ${message.name !== myuser?.username ? 'bg-green-400 text-white' : 'bg-gray-200 text-gray-800'} px-4 py-2 rounded-3xl ${message.name !== myuser?.username ? 'rounded-tl-none' : 'rounded-tr-none'}`}>
              <div>{parseMessage(message.body)}</div>
                <div className={`text-xs mt-1 ${message.name !== myuser?.username ? 'text-blue-200' : 'text-gray-400'}`}>{message.timestamp}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex items-center space-x-2 p-4 border-t bg-gray-50">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={2}
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
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chats;
