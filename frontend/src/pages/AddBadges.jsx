import React, { useState } from 'react';
import { Card, Input, Button, Textarea, Divider, Select, SelectItem, CardBody, CardHeader } from "@nextui-org/react";
import { useDispatch } from 'react-redux';
import { addBadges } from '../features/customAdmin/customAdminSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddBadges = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    badge_name: '',
    badge_type: '',
    badge_threshold: '',
    badge_description: '',
    badge_image: null,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    let errorMessage = '';
    if (name === 'badge_name' && (!value || typeof value !== 'string' || !value.trim())) {
      errorMessage = "Badge name is required";
    }
    if (name === 'badge_type' && (!value || typeof value !== 'string' || !value.trim())) {
      errorMessage = "Badge type is required";
      console.log(value,"value")
    }
    if (name === 'badge_threshold' && (!value || isNaN(value))) {
      errorMessage = "Threshold must be a number";
    }
    if (name === 'badge_description' && (!value || typeof value !== 'string' || !value.trim())) {
      errorMessage = "Description is required";
    }
    if (name === 'badge_image' && !value) {
      errorMessage = "Badge image is required";
    }
    return errorMessage;
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
    setTouched({ ...touched, [name]: true });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSelectChange = (value) => {
    console.log('Selected Badge Type:', value?.target?.value); // Debugging line to see the selected value
    setFormData({
      ...formData,
      badge_type: value?.target?.value,
    });
    setTouched({ ...touched, badge_type: true });

    // Clear error when user makes a selection
    if (errors.badge_type) {
      setErrors({
        ...errors,
        badge_type: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          formDataObj.append(key, value);
        }
      });

      try {
        const resultAction = await dispatch(addBadges(formDataObj));
        if (addBadges.fulfilled.match(resultAction)) {
          toast.success('Badge added successfully!');
          // Reset form
          setFormData({
            badge_name: '',
            badge_type: '',
            badge_threshold: '',
            badge_description: '',
            badge_image: null,
          });
          setTouched({});
          navigate('/admin/badges')
        } else if (addBadges.rejected.match(resultAction)) {
          toast.error(resultAction.payload || 'Failed to add badge');
        }
      } catch (error) {
        toast.error('An error occurred while adding the badge');
      } finally {
        setLoading(false);
      }
    } else {
      // Mark all fields as touched to show errors
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    }
  };

  return (
    <div className="flex justify-center mt-2">
      <Card className="w-2/3">
        <CardBody>
          <CardHeader className="flex flex-col items-center">
            <h1 className="text-3xl font-bold text-gray-700">Add New Badge</h1>
          </CardHeader>
          <Divider />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input 
              label="Badge Name" 
              name="badge_name" 
              value={formData.badge_name} 
              onChange={handleInputChange}
              onBlur={() => setTouched({ ...touched, badge_name: true })}
              isInvalid={touched.badge_name && errors.badge_name}
              errorMessage={touched.badge_name && errors.badge_name}
              isRequired
            />
            
            <Select
              label="Badge Type"
              placeholder="Select a badge type"
              value={formData.badge_type}
              onChange={handleSelectChange}
              isInvalid={touched.badge_type && errors.badge_type}
              errorMessage={touched.badge_type && errors.badge_type}
              isRequired
            >
              <SelectItem key="streak" value="streak">Streak</SelectItem>
              <SelectItem key="experience" value="experience">Experience</SelectItem>
            </Select>
            
            <Input
              label="Badge Threshold" 
              name="badge_threshold" 
              value={formData.badge_threshold} 
              onChange={handleInputChange}
              type="number"
              onBlur={() => setTouched({ ...touched, badge_threshold: true })}
              isInvalid={touched.badge_threshold && errors.badge_threshold}
              errorMessage={touched.badge_threshold && errors.badge_threshold}
              isRequired
            />

            <Textarea 
              label="Badge Description" 
              name="badge_description" 
              value={formData.badge_description} 
              onChange={handleInputChange}
              onBlur={() => setTouched({ ...touched, badge_description: true })}
              isInvalid={touched.badge_description && errors.badge_description}
              errorMessage={touched.badge_description && errors.badge_description}
              isRequired
            />

            <Input
              label="Badge Image" 
              type="file" 
              name="badge_image" 
              onChange={handleInputChange}
              onBlur={() => setTouched({ ...touched, badge_image: true })}
              isInvalid={touched.badge_image && errors.badge_image}
              errorMessage={touched.badge_image && errors.badge_image}
              accept="image/*"
            />

            <Button
              color="primary" 
              size="lg" 
              type="submit" 
              isLoading={loading}
              isDisabled={loading}
              className="w-full"
            >
              {loading ? 'Adding...' : 'Add Badge'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddBadges;
