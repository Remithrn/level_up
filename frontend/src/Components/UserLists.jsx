import React, { useState } from 'react';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { deactivateUser, fetchallUsers,getSalesDetails } from '../features/customAdmin/customAdminSlice'; // Updated import, removed getTotalSales
import { useDispatch } from 'react-redux';

const UserList = ({ users }) => {
  const [userList, setUserList] = useState(users);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();


  const handleDeactivateUser = (username) => {
    dispatch(deactivateUser(username)).then(() => {
      dispatch(fetchallUsers());
    });
  };

  const openUserDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Calculate overall statistics
  const totalUsers = userList.length;
  const activeUsers = userList.filter(user => user.is_active).length;
  const inactiveUsers = totalUsers - activeUsers;
  const totalExperiencePoints = userList.reduce((total, user) => total + user.experience_points, 0);
  const averageStreakLength = totalUsers > 0 ? (userList.reduce((total, user) => total + user.streak_length, 0) / totalUsers).toFixed(2) : 0;
  const subscribedUsers = userList.filter(user => user.subscription_status).length;

  return (
    <div className="user-list">
      {/* Overall Statistics */}
      <div className="overall-statistics mb-4 p-4 border border-gray-300 rounded">
        <h2 className="font-bold text-lg">Overall Statistics</h2>
        <p><strong>Total Users:</strong> {totalUsers}</p>
        <p><strong>Active Users:</strong> {activeUsers}</p>
        <p><strong>Inactive Users:</strong> {inactiveUsers}</p>
        <p><strong>Subscribed Users:</strong> {subscribedUsers}</p>
        <p><strong>Total Experience Points:</strong> {totalExperiencePoints}</p>
        <p><strong>Average Streak Length:</strong> {averageStreakLength}</p>
      </div>

      {userList.map(user => (
        <div key={user.username} className="user-card flex justify-between items-center" style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
          <img
            src={user.profile_picture 
              ? `${import.meta.env.VITE_BACKEND_URL}${user.profile_picture}` 
              : 'https://th.bing.com/th/id/OIP.OesLvyzDO6AvU_hYUAT4IAHaHa?w=250&h=250&c=8&rs=1&qlt=90&r=0&o=6&dpr=1.3rm=2&dpr=1.3&pid=ImgDetMain'}
            alt={`${user.first_name}'s profile`}
            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
          />
          <div className='flex justify-between items-center gap-6'>
            <h2 className='font-bold capitalize'>{user.first_name} {user.last_name}</h2>
            <Button color="primary" onClick={() => openUserDetails(user)}>
              View Details
            </Button>
          </div>
        </div>
      ))}

      {/* Modal for showing user details */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalContent>
          <ModalHeader>
            {selectedUser && (
              <>{selectedUser.first_name} {selectedUser.last_name}'s Details</>
            )}
          </ModalHeader>
          <ModalBody>
            {selectedUser && (
              <>
                <img
                  src={selectedUser.profile_picture 
                    ? `${import.meta.env.VITE_BACKEND_URL}${selectedUser.profile_picture}` 
                    : 'https://th.bing.com/th/id/OIP.OesLvyzDO6AvU_hYUAT4IAHaHa?w=250&h=250&c=8&rs=1&qlt=90&r=0&o=6&dpr=1.3rm=2&dpr=1.3&pid=ImgDetMain'}
                  alt={`${selectedUser.first_name}'s profile`}
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                />
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Bio:</strong> {selectedUser.bio || 'No bio available'}</p>
                <h3 className="mt-4">Statistics</h3>
                <ul className="list-disc list-inside">
                  <li><strong>Streak Length:</strong> {selectedUser.streak_length}</li>
                  <li><strong>Total Experience Points:</strong> {selectedUser.experience_points}</li>
                  <li><strong>AI Tokens:</strong> {selectedUser.ai_tokens}</li>
                </ul>
                <p><strong>Subscription Status:</strong> {selectedUser.subscription_status ? 'Subscribed' : 'Not Subscribed'}</p>
                <p><strong>Status:</strong> {selectedUser.is_active ? 'Active' : 'Inactive'}</p>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            {selectedUser && (
              <Button color='primary' onClick={() => handleDeactivateUser(selectedUser.username)}>
                {selectedUser.is_active ? 'Deactivate' : 'Activate'}
              </Button>
            )}
            <Button color='secondary' onClick={closeModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserList;
