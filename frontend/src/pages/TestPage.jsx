import React, { useEffect } from 'react'

import Profilefromyoutube from '../Components/Profilefromyoutube'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { fetchUserProfile } from '../features/authentication/ProfileSlice'
import ProfilePageTop from '../Components/ProfilePageTop'
import ProfileEditModal from '../Components/ProfileEditModal'

const TestPage = () => {
  const dispatch = useDispatch()
  const { profile, loading } = useSelector((state) => state.profile);
  
  const {isAuthenticated,access} = useSelector((state) => state.auth)
  if (!isAuthenticated && !localStorage.getItem('access')) {
    return <Navigate to="/login" />;
  }
  return (
    <div className=''>
     <ProfilePageTop profile={profile} ComponentProp={<ProfileEditModal loading={loading} />} />

      <Profilefromyoutube/>
      </div>
  )
}

export default TestPage