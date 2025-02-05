import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from '../features/authentication/AuthSlice';
import Card from "../Components/Card";
import { Input ,Button} from "@nextui-org/react";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // useNavigate hook for redirection
  const { isAuthenticated, loading, message, error } = useSelector((state) => state.auth); // Accessing auth state

  const [formData, setFormData] = useState({
    new_password1: "",
    new_password2: "",
    old_password: ""
  });
  const [isInvalid, setIsInvalid] = useState({
    new_password1: false,
    new_password2: false,
    old_password: false
  });
  const [errorMessage, setErrorMessage] = useState({
    new_password1: "",
    new_password2: "",
    old_password: ""
  });

  const { new_password1, new_password2, old_password } = formData;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for the field being edited
    setIsInvalid({ ...isInvalid, [e.target.name]: false });
    setErrorMessage({ ...errorMessage, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
  
    // Minimum Password Length
    if (new_password1.trim().length < 8) {
      setIsInvalid({ ...isInvalid, new_password1: true });
      setErrorMessage({ ...errorMessage, new_password1: "Password must be at least 8 characters" });
      hasError = true;
    }
  
    // Password Match
    if (new_password1 !== new_password2) {
      setIsInvalid({ ...isInvalid, new_password2: true });
      setErrorMessage({ ...errorMessage, new_password2: "Passwords do not match" });
      hasError = true;
    }
  
    if (hasError) {
      return;
    }
  
    dispatch(changePassword({ new_password1, new_password2, old_password }));
  };

  // Redirect to home page after a successful password change
  // useEffect(() => {
  //   if ( !error) {
  //     navigate("/"); // Navigate to home if password change was successful
  //   }
  // }, [message, error, navigate]);

  if (!isAuthenticated && !localStorage.getItem('access')) {
    return <Navigate to="/login" />;
  }

  return (
    <Card className="main-box ">
      <h2 className="text-center mb-4">Change Password</h2>
      {/* {message && <p className="text-center mb-4 text-green-500">{message}</p>} */}
      {/* {error && <p className="text-center mb-4 text-red-500">{error}</p>} */}
      <form className="mb-3" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="new_password1" className="form-label">New Password</label>
          <Input
            name="new_password1"
            value={new_password1}
            onChange={handleInputChange}
            type="password"
            className="form-control"
            id="new_password1"
            isInvalid={isInvalid.new_password1}
            errorMessage={errorMessage.new_password1}
            placeholder="New password ..."
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="new_password2" className="form-label">Re-enter New Password</label>
          <Input
            name="new_password2"
            value={new_password2}
            onChange={handleInputChange}
            type="password"
            className="form-control"
            id="new_password2"
            isInvalid={isInvalid.new_password2}
            errorMessage={errorMessage.new_password2}
            placeholder="Re-enter new password ..."
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="old_password" className="form-label">Old Password</label>
          <Input
            name="old_password"
            value={old_password}
            onChange={handleInputChange}
            type="password"
            className="form-control"
            id="old_password"
            required
            placeholder="Old password ..."
          />
        </div>
        <div className="d-grid gap-2">
          <Button color="success" type="submit" disabled={loading}>
            {loading ? 'Changing...' : 'Change Password'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ChangePassword;
