import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchfriendProfile } from '../features/friends/FriendSlice';
import Card from '../Components/Card';
import { Avatar, Button } from '@nextui-org/react';
import { sendFriendRequest, acceptFriendRequest, unfriend } from '../features/friends/FriendSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import dayjs from "dayjs";
import Swal from 'sweetalert2';
import { usersStreak } from '../features/LeetCode/LeetcodeSlice';
import moment from "moment";
import Calendar from "react-calendar"; // Import react-calendar
import 'react-calendar/dist/Calendar.css';
import { getUserBadgesWithUserId } from '../features/LeetCode/LeetcodeSlice';
import { FireSvg, EmptyFireSvg, LightningProgressSvg,BronzeLeagueSvg,EmptyMedalSvg } from "../Components/Svgs";
import FriendButtons from '../Components/FriendButtons';
import ProfilePageTop from '../Components/ProfilePageTop';
import BadgesSection from '../Components/BadgesSection';
import StatsCard from '../Components/StatsCard';

const UsersProfile = () => {
    const { access, isAuthenticated } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.friends);
    const { streaks,badges,otherBadges } = useSelector((state) => state.leetcode);
    const [now, setNow] = useState(dayjs());
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isCalendarOpen, setCalendarOpen] = useState(false);
    const [calendarValue, setCalendarValue] = useState(new Date());

    const streakStart = streaks?.streak_start_date ? moment(streaks.streak_start_date).toDate() : null;
    const streakEnd = streaks?.streak_end_date ? moment(streaks.streak_end_date).toDate() : null;

    const handleSendRequest = (userId) => {
        if (isAuthenticated) {
            dispatch(sendFriendRequest({ toUserId: userId, accessToken: access }));
        }
    };

    const handleAcceptRequest = (friendId) => {
        if (isAuthenticated) {
            dispatch(acceptFriendRequest({ friendId, accessToken: access }));
        }
    };

    const handleUnfriend = (friendId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be friends with this user anymore!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, unfriend!'
        }).then((result) => {
            if (result.isConfirmed) {
                if (isAuthenticated) {
                    dispatch(unfriend({ friendId }));
                    Swal.fire('Unfriended!', 'You are no longer friends with this user.', 'success');
                }
            }
        });
    };

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchfriendProfile({ friendId: id, accessToken: access }));
        }
        dispatch(usersStreak({ id: id }));
        dispatch(getUserBadgesWithUserId({ id: id }));
    }, [id, isAuthenticated, dispatch, access]);

    const handleStartConversation = (friendId) => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chat/start/${friendId}/`, {
      
            headers: {
                'Authorization': `Bearer ${access}`
            }
        })
        .then(response => {
            if (response.data.success) {
                navigate(`/chats/${response.data?.conversation_id}`);
            }
        })
        .catch(error => {
            console.log(error);
        });
    };

    const handleCalendarChange = (value) => {
        setCalendarValue(value);
    };

    return (
        <>
           
<ProfilePageTop
  profile={profile}
  ComponentProp={
    <FriendButtons
      profile={profile}
      handleSendRequest={handleSendRequest}
      handleAcceptRequest={handleAcceptRequest}
      handleUnfriend={handleUnfriend}
      handleStartConversation={handleStartConversation}
      isAuthenticated={isAuthenticated}
    />
  }
/>

           
            <Card>
    <h2 className="mb-5 text-2xl font-bold">Statistics</h2>

    <div className="grid grid-cols-2 gap-3">
      {/* Streak */}
      <StatsCard className="flex gap-2 rounded-2xl border-2 border-gray-200 p-2 md:gap-3 md:px-6 md:py-4">
        {streaks.streak_length === 0 ? <EmptyFireSvg /> : <FireSvg />}
        <div className="flex flex-col">
          <span
            className={[
              "text-xl font-bold",
              streaks.streak_length === 0 ? "text-gray-400" : "",
            ].join(" ")}
          >
            {streaks.streak_length || 0}
          </span>
          <span className="text-sm text-gray-400 md:text-base">Day Streak</span>
        </div>
      </StatsCard>

      {/* Total XP */}
      <StatsCard className="flex gap-2 rounded-2xl border-2 border-gray-200 p-2 md:gap-3 md:px-6 md:py-4">
        <LightningProgressSvg className="h-10 w-10" />
        <div className="flex flex-col">
          <span className="text-xl font-bold">{streaks.experience_points || 0}</span>
          <span className="text-sm text-gray-400 md:text-base">Total XP</span>
        </div>
      </StatsCard>

      {/* Current League */}
      {/* <div className="flex gap-2 rounded-2xl border-2 border-gray-200 p-2 md:gap-3 md:px-6 md:py-4">
        <BronzeLeagueSvg className="h-10 w-10" />
        <div className="flex flex-col">
          <span className="text-xl font-bold">{streaks.league || "Bronze"}</span>
          <span className="text-sm text-gray-400 md:text-base">Current League</span>
        </div>
      </div> */}

      {/* Top 3 Finishes */}
      {/* <div className="flex gap-2 rounded-2xl border-2 border-gray-200 p-2 md:gap-3 md:px-6 md:py-4">
        {streaks.top3Finishes === 0 ? <EmptyMedalSvg className="w-10 h-10" /> : <EmptyMedalSvg className="w-10 h-10" />}
        <div className="flex flex-col">
          <span
            className={[
              "text-xl font-bold",
              streaks.top3Finishes === 0 ? "text-gray-400" : "",
            ].join(" ")}
          >
            {streaks.top3Finishes || 0}
          </span>
          <span className="text-sm text-gray-400 md:text-base">Top 3 Finishes</span>
        </div>
      </div> */}
    </div>
  </Card>
 <BadgesSection badges={otherBadges}/>
                </>
    );
};

export default UsersProfile;
