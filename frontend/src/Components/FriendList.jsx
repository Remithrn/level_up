import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFriends } from '../features/authentication/ProfileSlice'; 
import { Link } from 'react-router-dom';
import { Accordion, AccordionItem } from '@nextui-org/react';
import { unfriend } from '../features/friends/FriendSlice'; 
import { ProfileFriendsSvg } from './Svgs';
import Swal from 'sweetalert2';
import StatsCard from './StatsCard';

const FriendList = () => {
  const dispatch = useDispatch();
  const { friends_list, loading, error } = useSelector((state) => state.profile); 

  const handleUnfriend = async (friendId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, unfriend it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      // Proceed with unfriend
      dispatch(unfriend({ friendId })).then(() => {
        dispatch(fetchFriends());
        Swal.fire(
          'Unfriended!',
          'Your friend has been removed.',
          'success'
        );
      });
    }
  };

  if (loading) {
    return <p>Loading friends...</p>;
  }

  if (error) {
    return <p>Error loading friends: {error?.detail || "An error occurred"}</p>;
  }

  return (
    <Accordion>
      <AccordionItem
        key="1"
        aria-label="Accordion 1"
        title="Friends"
        startContent={
         <ProfileFriendsSvg className="w-5 h-5" />
        }
      >
        <div className="friend-list">
          <h2 className="text-xl font-semibold mb-4">Friends</h2>
          <ul className="space-y-4">
            {friends_list && friends_list.length > 0 ? (
              friends_list.map((friend, index) => (
                <ul
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={
                          friend.profile_picture ||
                          'https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp'
                        }
                        alt={`${friend.username}'s profile`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <Link to={`/profile/${friend.user_id}`}>
                        <h3 className="text-lg font-medium">
                          {friend.first_name} {friend.last_name}
                        </h3>
                        <p className="text-sm text-gray-600">@{friend.username}</p>
                      </Link>
                    </div>
                  </div>
                  <button
                    className="btn-custom-red ml-4" // Added margin left for spacing
                    onClick={() => handleUnfriend(friend.user_id)}
                  >
                    Unfriend
                  </button>
                </ul>
              ))
            ) : (
              <p className="text-gray-500">You have no friends yet.</p>
            )}
          </ul>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default FriendList;
