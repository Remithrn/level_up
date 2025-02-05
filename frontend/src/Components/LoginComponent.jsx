import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Divider,CardBody,CardHeader } from "@nextui-org/react";
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/authentication/AuthSlice';
import { Navigate, Link } from "react-router-dom";

const LoginComponent = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { error, isAuthenticated, loading } = useSelector((state) => state.auth);

  const validateField = (name, value) => {
    let errorMessage = "";
    switch (name) {
      case 'email':
        if (!value.trim()) {
          errorMessage = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errorMessage = "Email is invalid";
        }
        break;
      case 'password':
        if (!value.trim()) {
          errorMessage = "Password is required";
        }
        break;
      default:
        break;
    }
    return errorMessage;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setTouched({ ...touched, [name]: true });
  };

  useEffect(() => {
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      if (touched[field]) {
        const errorMessage = validateField(field, formData[field]);
        if (errorMessage) {
          newErrors[field] = errorMessage;
        }
      }
    });
    setErrors(newErrors);
  }, [formData, touched]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const errorMessage = validateField(field, formData[field]);
      if (errorMessage) {
        newErrors[field] = errorMessage;
      }
    });

    if (Object.keys(newErrors).length === 0) {
      try {
        await dispatch(login(formData)).unwrap();
      } catch (err) {
        // Handle server-side errors
        if (err && typeof err === 'object') {
          setErrors(prevErrors => ({
            ...prevErrors,
            ...err,
            non_field_errors: err.non_field_errors || err.detail
          }));
        } else {
          setErrors(prevErrors => ({
            ...prevErrors,
            non_field_errors: 'An unexpected error occurred. Please try again.'
          }));
        }
      }
    } else {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, field) => ({ ...acc, [field]: true }), {}));
    }
  };

  const reachGoogle = () => {
    const clientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const callBackURI = `${import.meta.env.VITE_FRONTEND_URL}/`;
    window.location.replace(`https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${callBackURI}&prompt=consent&response_type=code&client_id=${clientID}&scope=openid%20email%20profile&access_type=offline`);
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const hasError = (field) => errors[field] && errors[field].length > 0;

  return (
    <div className='flex justify-center mt-2'>
      <Card className="w-2/3">
        <CardBody>
          <CardHeader className="flex flex-col">
            <h4 className=" font-extrabold text-3xl">Level Up </h4>
          </CardHeader>
          <Divider />
          <h3 className="text-default-500 text-center mb-1 font-bold text-2xl">Login</h3>

          {errors.non_field_errors && (
            <p color="error" className="text-center mb-4 text-red-500">{errors.non_field_errors}</p>
          )}
          <form className="mb-3" onSubmit={handleLogin}>
            <div className="mb-3">
              <Input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => setTouched({ ...touched, email: true })}
                type="email"
                label="Email"
                isInvalid={hasError("email")}
                errorMessage={errors.email}
              />
            </div>
            <div className="mb-3">
              <Input
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={() => setTouched({ ...touched, password: true })}
                type="password"
                label="Password"
                isInvalid={hasError("password")}
                errorMessage={errors.password}
              />
            </div>
            <div className="d-grid gap-2 justify-center">
              <Button 
                className='btn-custom-green'
                size="lg"
                type="submit" 
                disabled={loading || Object.keys(errors).length > 0}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
          <div className="d-grid gap-2 mt-2">
            <Button 
              className='btn-custom-blue'
              size="lg"
              onClick={reachGoogle}
            >
              Login With Google
            </Button>
          </div>
          <p className="text-center mt-4">
            Don't have an account? <Link to="../signup/" className='text-blue-400'>Sign up</Link>
          </p>
          <p>Forgot your password? <Link to={"../reset/password/"}  className='text-blue-400'>Reset Password</Link></p>
        </CardBody>
      </Card>
    </div>
  );
};

export default LoginComponent;