import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Input, Card, CardBody, CardHeader, Button, Divider } from "@nextui-org/react";
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../features/authentication/AuthSlice';

const Signup = () => {
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.auth);
  const {isAuthenticated} = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
 
  const [status, setStatus] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    password1: "",
    password2: ""
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const { email, username, first_name, last_name, password1, password2 } = formData;
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case 'email':
        if (!value) {
          error = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Email is invalid";
        }
        break;
      case 'username':
        if (!value) {
          error = "Username is required";
        } else if (value.trim().length < 3) {
          error = "Username must be at least 3 characters long";
        }
        break;
      case 'first_name':
      case 'last_name':
        if (!value) {
          error = `${name === 'first_name' ? 'First' : 'Last'} name is required`;
        }
        break;
      case 'password1':
        if (!value) {
          error = "Password is required";
        } else if (value.trim().length < 8) {
          error = "Password must be at least 8 characters long";
        }
        break;
      case 'password2':
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== formData.password1) {
          error = "Passwords do not match";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handlingInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setTouched({ ...touched, [name]: true });
  };

  useEffect(() => {
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      if (touched[field]) {
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field] = [error];
        }
      }
    });
    setErrors(newErrors);
  }, [formData, touched]);

  const handlingSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = [error];
      }
    });

    if (Object.keys(newErrors).length === 0) {
      try {
        await dispatch(signup(formData)).unwrap();
        setStatus(true);
      } catch (err) {
        console.log(err, "k");
        setErrors(err || {});
      }
    } else {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, field) => ({ ...acc, [field]: true }), {}));
    }
  };

  const hasError = (field) => errors[field] && errors[field].length > 0;

  if (status) {
    return <Navigate to="../" />;
  }

  return (
    <div className='flex justify-center mt-2'>
      <Card className="w-2/3">
        <CardBody>
          <CardHeader className="flex flex-col">
            <h4 className="font-bold  text-3xl">Level Up</h4>
          </CardHeader>
          <Divider />
          <p className="text-2xl text-default-500 text-center mb-1">Sign up</p>

          <form className="mb-3" onSubmit={handlingSubmit}>
            <div className="mb-3">
              <Input
                name="first_name"
                value={first_name}
                onChange={handlingInput}
                onBlur={() => setTouched({ ...touched, first_name: true })}
                type="text"
                id="first_name"
                label="First Name"
                isInvalid={hasError("first_name")}
                errorMessage={hasError("first_name") ? errors.first_name[0] : ""}
              />
            </div>
            <div className="mb-3">
              <Input
                name="last_name"
                value={last_name}
                onChange={handlingInput}
                onBlur={() => setTouched({ ...touched, last_name: true })}
                type="text"
                id="last_name"
                label="Last Name"
                isInvalid={hasError("last_name")}
                errorMessage={hasError("last_name") ? errors.last_name[0] : ""}
              />
            </div>
            <div className="mb-3">
              <Input
                name="email"
                value={email}
                onChange={handlingInput}
                onBlur={() => setTouched({ ...touched, email: true })}
                type="email"
                id="email"
                label="Email"
                isInvalid={hasError("email")}
                errorMessage={hasError("email") ? errors.email[0] : ""}
              />
            </div>
            <div className="mb-3">
              <Input
                name="username"
                value={username}
                onChange={handlingInput}
                onBlur={() => setTouched({ ...touched, username: true })}
                type="text"
                id="username"
                label="Username"
                isInvalid={hasError("username")}
                errorMessage={hasError("username") ? errors.username[0] : ""}
              />
            </div>
            <div className="mb-3">
              <Input
                name="password1"
                value={password1}
                onChange={handlingInput}
                onBlur={() => setTouched({ ...touched, password1: true })}
                type="password"
                id="password1"
                label="Password"
                isInvalid={hasError("password1")}
                errorMessage={hasError("password1") ? errors.password1[0] : ""}
              />
            </div>
            <div className="mb-3">
              <Input
                name="password2"
                value={password2}
                onChange={handlingInput}
                onBlur={() => setTouched({ ...touched, password2: true })}
                type="password"
                id="password2"
                label="Repeat Password"
                isInvalid={hasError("password2")}
                errorMessage={hasError("password2") ? errors.password2[0] : ""}
              />
            </div>
            <p className='text-red-500'>{errors?.non_field_errors?.join(", ")}</p>
            <div className="d-grid gap-2 justify-center">
              <Button className='btn-custom-green mx-auto' size='lg' type="submit" disabled={loading || Object.keys(errors).length > 0}>
                {loading ? 'Signing up...' : 'Signup'}
              </Button>
            </div>
          </form>
          <p className='text-center'>Already have an account? <Link to="../login/" className=' text-blue-400'>Login</Link></p>
        </CardBody>
      </Card>
    </div>
  );
}

export default Signup;