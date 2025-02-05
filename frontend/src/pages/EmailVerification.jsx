import React, { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { emailVerification } from "../features/authentication/AuthSlice";
import { Button } from "@nextui-org/react";

const EmailVerification = () => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(false);
  const { key } = useParams();

  const handlingSubmit = (e) => {
    e.preventDefault();
    dispatch(emailVerification(key));
    setStatus(true);
  };

  if (status) {
    return <Navigate to={"../login/"} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Activate Your Account
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Click the button below to activate your account
        </p>
        <form onSubmit={handlingSubmit}>
          <div className="flex justify-center">
            <Button color="success" type="submit" className="w-full">
              Activate Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailVerification;
