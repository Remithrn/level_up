import React from "react";
import { Avatar, Button } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { acceptFriendRequest, rejectFriendRequest } from '../features/friends/FriendSlice';
import { fetchFriends } from "../features/authentication/ProfileSlice";
import Card from "./Card";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid"; // Updated for Heroicons v2

const FriendRequests = ({ friendRequests, accessToken }) => {
  const dispatch = useDispatch();
  const { access } = useSelector((state) => state.auth);

  const handleAccept = (friendId) => {
    dispatch(acceptFriendRequest({ friendId, accessToken: access }));
    dispatch(fetchFriends());
  };

  const handleReject = (friendId) => {
    dispatch(rejectFriendRequest({ friendId}));
  };

  const formatDate = (timestamp) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(timestamp).toLocaleDateString(undefined, options);
  };
  if (friendRequests.length===0){
    return null
  }

  return (
    <Card className="friend-requests">
      {friendRequests.length === 0 ? (
        <>
        <h2 className="text-center text-2xl font-bold mb-4">Friend Requests</h2>
        <p className="text-center text-gray-500">No pending friend requests.</p>
        </>
      ) : (
        <>
          <h2 className="text-center text-2xl font-bold mb-4">Friend Requests</h2>
          <ul className="space-y-4">
            {friendRequests.map((request) => (
              <li key={request.id} className="flex items-center space-x-4 p-4 border-b rounded-md shadow-sm">
                <Avatar
                  src={request.from_user_profile_picture || "https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"}
                  size="lg"
                  className="border border-gray-300"
                />
                <div className="flex-grow">
                  <p className="font-medium text-lg">{request.from_user_username}</p>
                  <p className="text-sm text-gray-500">{request.from_user_email}</p>
                  <p className="text-sm text-gray-400">Requested on: {formatDate(request.timestamp)}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    color="success"
                    onClick={() => handleAccept(request.from_user_id)}
                    auto
                    endContent={<CheckCircleIcon className="h-5 w-5" />}
                    variant="bordered"
                  >
                    Accept
                  </Button>
                  <Button
                    color="danger"
                    onClick={() => handleReject(request.from_user_id)}
                    auto
                    endContent={<XCircleIcon className="h-5 w-5" />}
                    variant="bordered"
                  >
                    Reject
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
};

export default FriendRequests;
