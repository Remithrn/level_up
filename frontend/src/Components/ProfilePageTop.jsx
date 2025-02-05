import React from 'react'
import Card from './Card'
import { useSelector } from 'react-redux'
import { Avatar } from '@nextui-org/react'
import ProfileEditModal from './ProfileEditModal'

const ProfilePageTop = ({profile,ComponentProp}) => {
 
  return (
    
    <Card noPadding={true}>
    <div className="relative overflow-hidden rounded-lg shadow-md bg-white text-left">
      {/* Banner Section */}
      <div className="flex justify-center items-center overflow-hidden h-48 bg-gray-100">
        <img
          src={
            profile?.banner ||
            "https://kudratikahumbo.com/wp-content/uploads/2019/12/Hero-Banner-Placeholder-Light-1024x480-1.png"
          }
          alt={
            profile?.banner || "Default Banner"
          }
          className="object-cover w-full h-full transition-transform duration-300 ease-in-out transform hover:scale-105"
        />
      </div>

      {/* Avatar Section */}
      <div className="absolute top-32 left-6">
        <Avatar
          src={
            profile?.profile_picture||
            "https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
          }
          className="w-36 h-36 border-4 border-white rounded-full shadow-xl transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Profile Information */}
      <div className="p-6 pb-4">
        <div className="ml-40">
          {/* Username */}
          <h2 className="text-3xl font-semibold text-gray-900 capitalize">
            {profile?.first_name && profile?.last_name
              ? profile.first_name + " " + profile.last_name
              : profile?.username}
          </h2>

          {/* Bio */}
          <div className="mt-3 text-gray-700">
            <span className="font-semibold">Bio: </span>
            <span className="italic">{profile?.bio || "No bio available"}</span>
          </div>

          {/* Friends Count */}
          <div className="mt-3 text-gray-700">
            <span className="font-semibold">{profile?.friends_count || 0}</span>{" "}
            <span className="italic">friends</span>
          </div>

          {/* Edit Profile Button */}
          
          <div className="mt-4">
            {/* <ProfileEditModal loading={loading} /> */}
            {ComponentProp}
          </div>
        </div>
      </div>
    </div>
  </Card>
  )
}

export default ProfilePageTop