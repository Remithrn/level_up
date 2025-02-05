import React, { useState, useEffect } from 'react';
import Card from '../Components/Card';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react';
import { fetchFriends } from '../features/authentication/ProfileSlice';

const GroupSettings = () => {
  const { id } = useParams(); // Get group ID from URL params
  const [groupChat, setGroupChat] = useState(null);
  const [newMembers, setNewMembers] = useState([]); // Track new members selected from dropdown
  const { access, user } = useSelector((state) => state.auth); // Access token and current user info
  const [isAdmin, setIsAdmin] = useState(false);
  const { friends_list } = useSelector((state) => state.profile); // Friend list from Redux
  const dispatch = useDispatch();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Filter out existing group members from the friends list
  const [filteredFriends, setFilteredFriends] = useState([]);
  useEffect(() => {
    if (groupChat) {
      const existingUserIds = new Set(groupChat.users.map((user) => user.id));
      setFilteredFriends(friends_list.filter((friend) => !existingUserIds.has(friend.user_id)));
    }
  }, [friends_list, groupChat]);

  // Fetch group chat details including members and admins
  const fetchGroupChat = () => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/chat/group-chats/${id}/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      })
      .then((res) => {
        setGroupChat(res.data.group_chat);

        // Check if current user is an admin
        const userIsAdmin = res.data.group_chat.admins.some(
          (admin) => admin.user.id === user.pk // Compare with user's pk
        );
        setIsAdmin(userIsAdmin); // Set isAdmin state
      })
      .catch((error) => console.error('Error fetching group chat:', error));
  };

  useEffect(() => {
    fetchGroupChat();
    dispatch(fetchFriends()); // Fetch friends list for selecting members
  }, [id, access, dispatch]);

  // Handle adding new members to the group
  const handleAddMembers = () => {
    console.log(newMembers?.target?.value,"newMembers")
    const userIds = newMembers?.target?.value.split(',').map(id => id.trim()).map(id =>parseInt(id));
    console.log(userIds,"userIds")
    
    
    // console.log(userIds,"userIds")
    
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/group-chats/${id}/add-member/`,
        { user_ids: userIds }, // Payload with selected user IDs
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      )
      .then((res) => {
        fetchGroupChat(); // Refresh group chat after adding members
        setNewMembers([]); // Clear selected members
        onOpenChange(); // Close the modal
      })
      .catch((error) => console.error('Error adding members:', error));
  };

  // Handle removing a member from the group
  const handleRemoveMember = (userId) => {
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/group-chats/${id}/remove-member/`,
        { user_id: userId },
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      )
      .then((res) => {
        fetchGroupChat(); // Refresh group chat after removing a member
      })
      .catch((error) => console.error('Error removing member:', error));
  };

  return (
    <Card>
      <h1 className="text-lg font-bold">Group Settings</h1>

      {groupChat ? (
        <div>
          <p>
            <strong>Group Name:</strong> {groupChat.name}
          </p>
          <p>
            <strong>Description:</strong> {groupChat.description}
          </p>

          {/* Display Group Members */}
          <h2 className="mt-4 text-md font-bold">Members</h2>
          <ul className="list-disc pl-5">
            {groupChat.users.map((member) => (
              <li key={member.id} className="flex justify-between items-center gap-2 mb-2">
                <span>{member.username}</span>
                {isAdmin && member.id !== user.pk && (
                  <button 
                    onClick={() => handleRemoveMember(member.id)}
                    className="btn-custom-red"  
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* Add New Members Section (Only for Admins) */}
          {isAdmin && (
            <div className="mt-4">
              <Button onClick={onOpen} className='btn-custom-yellow'>Add New Members</Button>
              <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                  <ModalHeader>
                    <h1 className='text-2xl font-bold'>Add New Members</h1>
                  </ModalHeader>
                  <ModalBody>
                    <Select
                      label="Select Friends"
                      placeholder="Choose friends to add"
                      selectionMode="multiple"
                      onChange={(selected) => setNewMembers(selected)}
                    >
                      {filteredFriends.map((friend) => (
                        <SelectItem key={friend.user_id} value={friend}>
                          {friend.username}
                        </SelectItem>
                      ))}
                    </Select>
                  </ModalBody>
                  <ModalFooter>
                    <Button onClick={onOpenChange}>Cancel</Button>
                    <Button onClick={handleAddMembers}>Add Members</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
          )}
        </div>
      ) : (
        <p>Loading group settings...</p>
      )}
    </Card>
  );
};

export default GroupSettings;
