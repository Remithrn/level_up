"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../features/friends/FriendSlice";
import { Input } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "./SearchIcon";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

const SearchFriendsComponent = () => {
  const [query, setQuery] = useState("");
  const [retryCount, setRetryCount] = useState(0); // For tracking retries
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { searchResults, loading, error } = useSelector((state) => state.friends);
  const [open, setOpen] = useState(false);
  const { access, isAuthenticated } = useSelector((state) => state.auth);

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const verifyAndRetry = () => {
    if (retryCount < 3) { // Retry up to 3 times
      setRetryCount(retryCount + 1);
      fetchUsersDebounced(query); // Retry fetching users
    } else {
      console.error("Failed after multiple attempts");
    }
  };

  const fetchUsersDebounced = useCallback(
    debounce(async (query) => {
      if (isAuthenticated) {
        try {
          await dispatch(fetchUsers({ query, accessToken: access }));
          setRetryCount(0); // Reset retry count on success
        } catch (err) {
          console.error("Fetch failed, retrying...", err);
          verifyAndRetry(); // Handle error and retry
        }
      }
    }, 300),
    [isAuthenticated, dispatch, access, retryCount]
  );

  useEffect(() => {
    if (query.length >= 2) {
      fetchUsersDebounced(query);
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [query, fetchUsersDebounced, isAuthenticated, dispatch, access]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleUserClick = (userId) => {
    console.log("Clicked user ID:", userId);
    setQuery("");
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="relative p-4 m-4 flex items-center flex-col gap-2 mb-3">
      <Input
        classNames={{
          base: "max-w-full sm:max-w-[50rem] h-10",
          mainWrapper: "h-full",
          input: "text-small",
          inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
        }}
        placeholder="Type to search..."
        size="sm"
        startContent={<SearchIcon size={18} />}
        type="search"
        value={query}
        onChange={handleChange}
      />
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {open && (
        <ul className="w-full mt-2 bg-slate-100 shadow-sm rounded-md absolute top-full left-0">
          {searchResults.length > 0 ? (
            searchResults.map((user) => (
              <li
                key={user.id}
                className="flex justify-between items-center mb-2 p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleUserClick(user.id)}
              >
                {user.username}
              </li>
            ))
          ) : (
            query.length >= 2 && !loading && !error && <p>No results found</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchFriendsComponent;
