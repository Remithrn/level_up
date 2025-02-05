"use client";
import { useSelector } from "react-redux";
import Card from "./Card";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import FriendList from "./FriendList";
import FriendRequests from "./FriendRequests";
import { verify } from "../features/authentication/AuthSlice";
import { getDailyTasks, getStreaks } from "../features/LeetCode/LeetcodeSlice";
import DailyTasks from "./DailyTask";
import moment from "moment";
import Calendar from "react-calendar"; // Import react-calendar
import 'react-calendar/dist/Calendar.css'; // Import CSS for the calendar
import { FireSvg, EmptyFireSvg, LightningProgressSvg, BronzeLeagueSvg, EmptyMedalSvg, LessonTopBarHeart } from "./Svgs";
import { UnlimitedHeart } from "./Svgs";


import BadgesSection from "./BadgesSection";
import StatsCard from "./StatsCard";
export default function Profilefromyoutube() {
  const dispatch = useDispatch();
  const { isAuthenticated, access } = useSelector((state) => state.auth);


  useEffect(() => {
    dispatch(verify());
    dispatch(getDailyTasks());
    dispatch(getStreaks());
    


  }, [dispatch, isAuthenticated, access]);

  const { profile, loading } = useSelector((state) => state.profile);
  const { friendRequests } = useSelector((state) => state.friends);
  const { dailyTasks, streaks } = useSelector((state) => state.leetcode);

  // State to manage calendar visibility
  const [isCalendarOpen, setCalendarOpen] = useState(false);

  const streakStart = streaks?.streak_start_date ? moment(streaks.streak_start_date).toDate() : null;
  const streakEnd = streaks?.streak_end_date ? moment(streaks.streak_end_date).toDate() : null;

  // Set the value of the calendar to the range of dates
  const calendarValue = [streakStart, streakEnd];

  return (
    <>
     

     <Card>
  <section>
    <h2 className="mb-5 text-2xl font-bold">Statistics</h2>
    <div className="grid grid-cols-2 gap-3">
      {/* Streak */}
      <StatsCard>
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
      <StatsCard>
        <LightningProgressSvg className="h-10 w-10" />
        <div className="flex flex-col">
          <span className="text-xl font-bold">{streaks.experience_points || 0}</span>
          <span className="text-sm text-gray-400 md:text-base">Total XP</span>
        </div>
      </StatsCard>

      {/* Current League */}
      <StatsCard>
        {profile?.subscription_status === true ? (
          <UnlimitedHeart className="h-10 w-10" />
        ) : (
          <LessonTopBarHeart className="h-10 w-10" />
        )}
        <div className="flex flex-col">
          <span className="text-xl font-bold">
            {profile?.subscription_status === true ? "Unlimited" : profile?.ai_tokens}
          </span>
          <span className="text-sm text-gray-400 md:text-base">Ai tokens</span>
        </div>
      </StatsCard>

      {/* Top 3 Finishes (commented out, kept as requested) */}
      {/* <StatsCard>
        {streaks.top3Finishes === 0 ? (
          <EmptyMedalSvg className="w-10 h-10" />
        ) : (
          <EmptyMedalSvg className="w-10 h-10" />
        )}
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
      </StatsCard> */}
    </div>

    <Button
      color="primary"
      className="cursor-pointer mt-2 btn-custom-blue mx-auto"
      onClick={() => setCalendarOpen(!isCalendarOpen)}
    >
      View Streak Details
    </Button>

    {/* Calendar with fade-in animation */}
    {isCalendarOpen && (
      <div
      
        className="calendar-container mt-4 mx-auto"
      >
        <Calendar
          value={calendarValue}
          onClickDay={() => {}}
          onChange={() => {}}
          view="month"
          className="cursor-default mx-auto"
        />
      </div>
    )}
  </section>
  
</Card>

      <Card>
        <FriendList />
      </Card>
     <BadgesSection/>

      <Card>
        <DailyTasks dailyTasks={dailyTasks} />
      </Card>

      <FriendRequests friendRequests={friendRequests} />

      
    </>
  );
}
