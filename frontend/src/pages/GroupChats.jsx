import React, { useState, useEffect } from 'react';
import Card from '../Components/Card';
import axios from 'axios';
import CreateGroups from '../Components/CreateGroups';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Divider } from '@nextui-org/react';

const GroupChats = () => {
  const [groupChats, setGroupChats] = useState([]);
  const { access } = useSelector((state) => state.auth);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chat/group-chats/`, {
      headers: {
        'Authorization': `Bearer ${access}`,
      },
    })
    .then((response) => {
      setGroupChats(response.data);
    });
  }, [access, changed]);

  return (
    <Card>
      <div className="p-8">
        
      <h1 className="text-3xl font-bold mb-6 border-b pb-4  uppercase" >Group Chat</h1>
      <Divider  />
        <div className="space-y-6">
          {groupChats.length > 0 ? (
            groupChats.map((groupChat) => (
              <div
                key={groupChat.id}
                className="flex flex-col items-start gap-2 self-start rounded-2xl border-b-4 border-violet-500 bg-violet-400 px-5 py-6 font-bold uppercase text-white transition hover:brightness-110 md:flex"
              >
                <Link
                  to={`/group-chat/${groupChat.id}`}
                  className="text-2xl font-bold text-white block transition-colors hover:text-gray-200"
                >
                  {groupChat.name}
                </Link>
                <Divider className='bg-white' />
                {groupChat.admins.length > 0 && (
                  <p className="text-white">
                    Admin: {groupChat.admins.map((admin) => admin.user.username).join(', ')}
                  </p>
                )}
                <p className="text-white">
                  Members: {groupChat.users.length > 3
                    ? `${groupChat.users.slice(0, 3).map((user) => user.username).join(', ')}, and ${groupChat.users.length - 3} more`
                    : groupChat.users.map((user) => user.username).join(', ')}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center text-lg">
              No group chats available.
            </p>
          )}
        </div>
        <div className="mt-8">
          <CreateGroups setChanged={setChanged} />
        </div>
      </div>
    </Card>
  );
};

export default GroupChats;
