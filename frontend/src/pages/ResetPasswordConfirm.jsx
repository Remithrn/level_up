import React, { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordConfirm } from "../features/authentication/AuthSlice";
import Card from "../Components/Card";
import { Input } from "@nextui-org/react";

const ResetPasswordConfirm = () => {
  const dispatch = useDispatch();
  const { uid, token } = useParams();
  const [formData, setFormData] = useState({
    new_password1: "",
    new_password2: "",
  });
  const [status, setStatus] = useState(false);
  const { error } = useSelector((state) => state.auth);

  const { new_password1, new_password2 } = formData;

  // Handling input changes
  const handlingInput = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Form submission
  const handlingSubmit = (e) => {
    e.preventDefault();

    // Check if the passwords match
    if (new_password1 !== new_password2) {
      alert("Passwords do not match.");
      return;
    }

    // Check password length
    if (new_password1.trim().length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    console.log("UID:", uid);
    console.log("Token:", token);
    console.log("Password 1:", new_password1);
    console.log("Password 2:", new_password2);

    // Dispatch resetPasswordConfirm action
    dispatch(resetPasswordConfirm({ uid, token, new_password1, new_password2 }));

    setStatus(true);
  };

  // If reset is successful, navigate to the login page
  if (status) {
    return <Navigate to="../login/" />;
  }

  return (
    <Card className="m-2">
      <h2 className="text-center text-red-300 mb-4">Set Password</h2>

      {/* Display any error messages */}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <form className="mb-3" onSubmit={(e) => handlingSubmit(e)}>
        <div className="mb-3">
          <label htmlFor="new_password1" className="form-label">
            New Password
          </label>
          <Input
            name="new_password1"
            value={new_password1}
            onChange={(e) => handlingInput(e)}
            type="password"
            className="form-control"
            id="new_password1"
            placeholder="New password ..."
          />
        </div>
        <div className="mb-3">
          <label htmlFor="new_password2" className="form-label">
            Re-enter New Password
          </label>
          <Input
            name="new_password2"
            value={new_password2}
            onChange={(e) => handlingInput(e)}
            type="password"
            className="form-control"
            id="new_password2"
            placeholder="Re-enter new password ..."
          />
        </div>
        <div className="d-grid gap-2">
          <button className="btn btn-primary" type="submit">
            Set Password
          </button>
        </div>
      </form>
    </Card>
  );
};

export default ResetPasswordConfirm;
