import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { User } from "@nextui-org/react";
import Card from '../Components/Card';

const Inbox = () => {
  const { access } = useSelector((state) => state.auth);
  const [conversations, setConversations] = useState([]);
  
  const fetchConversations = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      } else {
        console.error('Error fetching conversations:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const currentUser = useSelector((state) => state.auth.user);
  
  const otherUser = (conversation) => {
    return conversation.users.find((user) => user.id !== currentUser.pk);
  };

  useEffect(() => {
    if (access) {
      fetchConversations();
    }
  }, [access]);

  return (
    <Card className="min-h-screen bg-gray-100 py-10">
      <main >
        <h1 className="text-3xl font-bold mb-6 border-b pb-4  uppercase" >Inbox</h1>

        <div className='flex flex-col justify-start items-start gap-4'>
          {conversations.length > 0 ? (
            conversations.map((conversation) => (
              <User
                 className="flex flex-col w-full items-start gap-2 self-start rounded-2xl border-b-4 border-violet-400 bg-violet-300 px-5 py-6 font-bold uppercase text-white transition hover:brightness-110 md:flex"
                key={conversation.id}
                description={(
                  <Link to={`/chats/${conversation.id}`} className='text-sm font-medium text-blue-600 hover:text-blue-800'>
                    @{otherUser(conversation).username}
                  </Link>
                )}
                avatarProps={{
                  src: `${otherUser(conversation).profile_picture}`,
                }}
              >
                <div className="flex flex-col ml-4">
                  <p className="text-gray-800 font-semibold">{otherUser(conversation).username}</p>
                  {/* You can add more user details here if needed */}
                </div>
              </User>
            ))
          ) : (
            <p className="text-center text-gray-500">No conversations found.</p>
          )}
        </div>
      </main>
    </Card>
  );
};

export default Inbox;
