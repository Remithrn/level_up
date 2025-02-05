import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  updateUserProfile,
} from "../features/authentication/ProfileSlice";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { Input, Textarea } from "@nextui-org/react";

import { useEffect, useState } from "react";
import { verify } from "../features/authentication/AuthSlice";

import { EditPencilSvg } from "./Svgs";

const ProfileEditModal = () => {
  
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const dispatch = useDispatch();

  const { profile, loading, success, error } = useSelector(
    (state) => state.profile
  );
  const [isInvalid, setInvalid] = useState(
    {
      bio: false,
      first_name: false,
      last_name: false,
      email: false,
      username: false,
      profile_picture: false,
      banner: false,
    }
  );
  const [errorMessage, setErrorMessage] = useState({
    bio: "",
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    profile_picture: "",
    banner: "",
  });

  const [formData, setFormData] = useState({
    bio: "",
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    profile_picture: null,
    banner: null,
  });

  useEffect(() => {
    dispatch(verify());
    dispatch(fetchUserProfile());

    if (success && profile) {
      setFormData({
        bio: profile.bio || "",
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        username: profile.username || "",
        profile_picture: null, // To avoid setting URLs as files
        banner: null,
      });
    }
  }, [success,dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    //check if the file is an image
    if (name === "profile_picture" || name === "banner") {
      if (!e.target.files[0].type.startsWith("image/")) {
        setErrorMessage((prev) => ({
          ...prev,
          [name]: "Please select an image file.",
        }));
        setInvalid((prev) => ({
          ...prev,
          [name]: true,
        }));
        return;
      }
    }
   //checking if length smaller than 3
    else if (name === "bio" || name === "first_name" || name === "last_name" || name === "username") {
      if (value.trim().length <= 3) {
        setErrorMessage((prev) => ({
          ...prev,
          [name]: "Please enter at least 3 characters.",
        }));
        setInvalid((prev) => ({
          ...prev,
          [name]: true,
        }));
        setFormData({
          ...formData,
          [name]: value,
        });
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
    setInvalid((prev) => ({
      ...prev,
      [name]: false,
    }));
    setErrorMessage((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    //check if the file is an image
    if (!files[0].type.startsWith("image/")) {
      setErrorMessage((prev) => ({
        ...prev,
        [name]: "Please select an image file.",
      }));
      setInvalid((prev) => ({
        ...prev,
        [name]: true,
      }));
      return;
    }
    setFormData({
      ...formData,
      [name]: files[0], // Set the first file as the selected one
    });
    setInvalid((prev) => ({
      ...prev,
      [name]: false,
    }));
    setErrorMessage((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //check if all fields are valid
    if(isInvalid.bio || isInvalid.first_name || isInvalid.last_name || isInvalid.email || isInvalid.username || isInvalid.profile_picture || isInvalid.banner){
      return;
    }
    const updatedProfile = new FormData(); // Using FormData to handle file uploads
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        updatedProfile.append(key, formData[key]);
        console.log(updatedProfile)
      }
    });

    dispatch(updateUserProfile(updatedProfile));
    onOpenChange();
  };

  return (
    <>
    <div className="flex justify-end">

      <Button   className="hidden items-center gap-2 self-start rounded-2xl border-b-4 border-blue-500 bg-blue-400 px-5 py-6 font-bold uppercase text-white transition hover:brightness-110 md:flex"endContent={   <EditPencilSvg />} onPress={onOpen}>Edit my profile</Button>
    </div>
  
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="font-bold text-2xl">Edit Your Profile</h2>
              </ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit} className="profile-form">
                  <div>
                    <label htmlFor="bio">Bio</label>
                    <Textarea
                      className="bg-white"
                      name="bio"
                      isInvalid={isInvalid.bio}
                      errorMessage={errorMessage.bio}
                      value={formData.bio}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="first_name">First Name</label>
                    <Input
                      className="bg-white"
                      type="text"
                      name="first_name"
                      isInvalid={isInvalid.first_name}
                      errorMessage={errorMessage.first_name}
                      value={formData.first_name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="last_name">Last Name</label>
                    <Input
                      className="bg-white"
                      type="text"
                      name="last_name"
                      isInvalid={isInvalid.last_name}
                      errorMessage={errorMessage.last_name}
                      value={formData.last_name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="email">Email</label>
                    <Input
                      className="bg-white"
                      type="email"
                      name="email"
                      isDisabled
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="username">Username</label>
                    <Input
                      className="bg-white"
                      type="text"
                      name="username"
                      isInvalid={isInvalid.username}
                      errorMessage={errorMessage.username}
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="profile_picture">Profile Picture</label>
                    <Input
                      className="bg-white"
                      type="file"
                      name="profile_picture"
                      isInvalid={isInvalid.profile_picture}
                      errorMessage={errorMessage.profile_picture}
                      onChange={handleFileChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="banner">Banner</label>
                    <Input
                      className="bg-white"
                      type="file"
                      name="banner"
                      isInvalid={isInvalid.banner}
                      errorMessage={errorMessage.banner}
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="mt-2 flex justify-end gap-2">
                    <Button className="btn-custom-ghost-red" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button className="btn-custom-blue" type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save Profile"}
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileEditModal