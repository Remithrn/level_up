import React from 'react'
import Card from '../Components/Card'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchallUsers,getSalesDetails } from '../features/customAdmin/customAdminSlice';
import UserList from '../Components/UserLists';
import ThreeDotsWave from '../Components/AnimateLoader';

export const AdminDashboard = () => {
  const {users,loading} = useSelector((state) => state.customAdmin)
  const dispatch = useDispatch();
  

  
  useEffect(() => {
    dispatch(fetchallUsers())
  }, [])  
  if(loading){
    return(

      <ThreeDotsWave/> 
    ) 
  }
  return (
    <div className="admin-dashboard">

      <section className="analytics-cards">
        <Card>
          <h3 className=' font-bold text-2xl'>User </h3>
          <UserList users = {users}/>
        </Card>
        <Card>
       
        </Card>
        
       
      </section>

      {/* System Health */}
    </div>
  )
}