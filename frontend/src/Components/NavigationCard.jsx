import React from "react";
import { RiRobot3Line } from "react-icons/ri";
import { LuTrophy } from "react-icons/lu";
import Card from "./Card";
import LogoutButton from "./LogoutButton";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button} from "@nextui-org/react";

const NavigationCard = () => {

  const { profile, loading } = useSelector((state) => state.profile);
  return (
    <Card>
      <div className="px-4 py-2">
        <h2 className="text-gray-400 mb-3">Navigation</h2>

        <Link
          to="/"
          className="hover:-mx-3 flex gap-3 py-3 transition-transform transform hover:scale-105 hover:bg-blue-100 hover:shadow-lg rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          Home
        </Link>

        <Link
          to="/inbox"
          className="hover:-mx-3 flex gap-3 py-3 transition-transform transform hover:scale-105 hover:bg-blue-100 hover:shadow-lg rounded-lg"
        >
        
       <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
            />
          </svg>
      Inbox
        </Link>
        <Link
          to="/group-chat"
          className="hover:-mx-3 flex gap-3 py-3 transition-transform transform hover:scale-105 hover:bg-blue-100 hover:shadow-lg rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
            />
          </svg>
          Group Chat
        </Link>
        <Link
          to="/ai-chatbot"
          className="hover:-mx-3 flex gap-3 py-3 transition-transform transform hover:scale-105 hover:bg-blue-100 hover:shadow-lg rounded-lg"

        >
          <RiRobot3Line className="size-6 font-bold" />
         
        ChatBot
        </Link>



        <Link
          to="/leaderboard"
          className="hover:-mx-3 flex gap-3 py-3 transition-transform transform hover:scale-105 hover:bg-blue-100 hover:shadow-lg rounded-lg"
        >
          <LuTrophy  className="size-6 " />
          LeaderBoard
        </Link>
        <Link
          to="/ai/interview"
          className="hover:-mx-3 flex gap-3 py-3 transition-transform transform hover:scale-105 hover:bg-blue-100 hover:shadow-lg rounded-lg"
        >
          <img
            src="/interview-svgrepo-com.svg"
            alt="AI Interview"
            className="size-6 font-bold"
          />
          AI Interview
        </Link>
        <Link
          to="/ai/quiz"
          className="hover:-mx-3 flex gap-3 py-3 transition-transform transform hover:scale-105 hover:bg-blue-100 hover:shadow-lg rounded-lg"
        >
          <img
            src="/quiz.png"
            alt="AI Interview"
            className="size-6 font-bold"
          />
          AI Quiz
        </Link>
        <Link
          to="/leetcode-submission/list"
          className="hover:-mx-3 flex gap-3 py-3 transition-transform transform hover:scale-105 hover:bg-blue-100 hover:shadow-lg rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            strokeWidth={1.5}
            className="size-6"
            enable-background="new 0 0 24 24"
            viewBox="0 0 24 24"
            id="leetcode"
          >
            <path d="M22,14.355c0-0.742-0.564-1.346-1.26-1.346H10.676c-0.696,0-1.26,0.604-1.26,1.346s0.563,1.346,1.26,1.346H20.74C21.436,15.702,22,15.098,22,14.355z"></path>
            <path d="M3.482,18.187l4.313,4.361C8.768,23.527,10.113,24,11.598,24c1.485,0,2.83-0.512,3.805-1.494l2.588-2.637c0.51-0.514,0.492-1.365-0.039-1.9c-0.531-0.535-1.375-0.553-1.884-0.039l-2.676,2.607c-0.462,0.467-1.102,0.662-1.809,0.662s-1.346-0.195-1.81-0.662l-4.298-4.363c-0.463-0.467-0.696-1.15-0.696-1.863c0-0.713,0.233-1.357,0.696-1.824l4.285-4.38c0.463-0.467,1.116-0.645,1.822-0.645s1.346,0.195,1.809,0.662l2.676,2.606c0.51,0.515,1.354,0.497,1.885-0.038c0.531-0.536,0.549-1.387,0.039-1.901l-2.588-2.636c-0.649-0.646-1.471-1.116-2.392-1.33l-0.034-0.007l2.447-2.503c0.512-0.514,0.494-1.366-0.037-1.901c-0.531-0.535-1.376-0.552-1.887-0.038L3.482,10.476C2.509,11.458,2,12.813,2,14.311C2,15.809,2.509,17.207,3.482,18.187z"></path>
          </svg>
          Leetcode
        </Link> 
       {profile?.subscription_status===false ? <Link
          to="/payment"
          className="hover:-mx-3 flex gap-3 py-3 transition-transform transform hover:scale-105 hover:bg-blue-100 hover:shadow-lg rounded-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
          </svg>
          Subscribe 
        </Link>:null}

        <div className="flex gap-3 py-3 transition-transform transform hover:scale-105 hover:bg-blue-100 hover:shadow-lg rounded-lg hover:-mx-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
            />
          </svg>
          <LogoutButton />
        </div>
      </div>
    </Card>
  );
};

export default NavigationCard;
