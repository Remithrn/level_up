import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetPassword } from "../features/authentication/AuthSlice";
import Card from "../Components/Card";
import { Input, Button } from "@nextui-org/react";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(false);
  const [formData, setFormData] = useState({ email: "" });
  const [loading, setLoading] = useState()
  const { email } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Add a loading state
    try {
      await dispatch(resetPassword(email)).unwrap();
      setStatus(true);
    } catch (error) {
      console.error("Failed to send reset link", error);
      // Optionally set an error message in state to display to the user
    } finally {
      setLoading(false);
    }
  };

  if (status) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex items-center justify-center m-2">
      <Card className="m-4">
        <h2 className="text-center mb-4 text-2xl font-bold">Reset Password</h2>
        <h5 className="text-center mb-4">
          Please input your registered email. The link to set your new password will be sent to your email.
        </h5>
        <form className="mb-3" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <Input
              name="email"
              required
              value={email}
              onChange={handleInputChange}
              type="email"
              className="max-w-md mx-auto"
              id="email"
              placeholder="name@example.com"
            />
          </div>
          <div className="d-grid gap-2">
            <Button className="btn-custom-green mx-auto" type="submit">
              {loading ? "Sending..." : "Send Link"}
            </Button>
          </div>
        </form>
      </Card></div>
  );
};

export default ResetPassword;
