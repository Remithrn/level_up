import React from "react";
import { RiUserHeartLine } from "react-icons/ri";
import { SlBadge } from "react-icons/sl";
import { IoStatsChartOutline } from "react-icons/io5";
import Card from "./Components/Card";
import LogoutButton from './Components/LogoutButton'
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminNavigationCard = () => {

  const { profile, loading } = useSelector((state) => state.profile);
  return (
    <Card>
      <div className="px-4 py-2">
        <h2 className="text-gray-400 mb-3">Navigation</h2>

        

       


        <Link
          to="/admin/dashboard"
          className="hover:-mx-3 flex gap-3 py-3 transition-transform transform hover:scale-105 hover:bg-blue-100 hover:shadow-lg rounded-lg"
        >
          <IoStatsChartOutline className="size-6" />
          Dashboard
        </Link>

        <Link
          to="/admin/subscribers"
          className="hover:-mx-3 flex gap-3 py-3 transition-transform transform hover:scale-105 hover:bg-blue-100 hover:shadow-lg rounded-lg"
        >
         <RiUserHeartLine className="size-6" />
          Subscribers
        </Link>
        <Link
          to="/admin/badges"
          className="hover:-mx-3 flex gap-3 py-3 transition-transform transform hover:scale-105 hover:bg-blue-100 hover:shadow-lg rounded-lg"
        >
          <SlBadge className="size-6" />
          Add Badges
        </Link>
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

export default AdminNavigationCard;
