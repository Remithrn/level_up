// FriendButtons.js
import React from 'react';
import { Button } from '@nextui-org/react';
import Swal from 'sweetalert2';

const FriendButtons = ({
  profile,
  handleSendRequest,
  handleAcceptRequest,
  handleUnfriend,
  handleStartConversation,

}) => {
  


  return (
    <div className="flex justify-end gap-3 mt-4">
      {profile?.request_status === "none" ? (
        <Button
          onClick={() => handleSendRequest(profile?.friend_id)}
          color="primary"
          className="hidden md:flex items-center gap-2 rounded-2xl border-b-4 border-blue-500 bg-blue-400 px-5 py-6 font-bold uppercase text-white transition hover:brightness-110"
        >
          Send Request
        </Button>
      ) : profile?.request_status === "sent" ? (
        <Button
          isDisabled
          color="primary"
          className="hidden md:flex items-center gap-2 rounded-2xl border-b-4 border-slate-500 bg-slate-400 px-5 py-6 font-bold uppercase text-white"
        >
          Request Sent
        </Button>
      ) : profile?.request_status === "received" ? (
        <Button
          onClick={() => handleAcceptRequest(profile?.friend_id)}
          className="hidden md:flex items-center gap-2 rounded-2xl border-b-4 border-green-500 bg-green-400 px-5 py-6 font-bold uppercase text-white transition hover:brightness-110"
          variant="bordered"
        >
          Accept Request
        </Button>
      ) : profile?.request_status === "friend" ? (
        <>
          <Button
            onClick={() => handleUnfriend(profile?.friend_id)}
            className="hidden md:flex items-center gap-2 rounded-2xl border-b-4 border-red-500 bg-red-400 px-5 py-6 font-bold uppercase text-white transition hover:brightness-110"
            variant="bordered"
          >
            Unfriend
          </Button>
        </>
      ) : null}

      {/* Start Conversation Button */}
      <Button
        onClick={() => handleStartConversation(profile?.friend_id)}
        className="hidden md:flex items-center gap-2 rounded-2xl border-b-4 border-violet-500 bg-violet-400 px-5 py-6 font-bold uppercase text-white transition hover:brightness-110"
        variant="bordered"
      >
        Start Conversation
      </Button>
    </div>
  );
};

export default FriendButtons;
