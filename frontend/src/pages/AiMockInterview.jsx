import React, { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { Input, Textarea } from "@nextui-org/react";
import { useDispatch, useSelector } from 'react-redux';
import { generateInterviewQuestions, getAllInterviews } from '../features/AiMockinterview/interviewSlice';
import { useNavigate } from 'react-router-dom';
import Card from '../Components/Card';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { deleteInterview } from '../features/AiMockinterview/interviewSlice';
import Swal from 'sweetalert2';

const AiMockInterview = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [jobPosition, setJobPosition] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobExperience, setJobExperience] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mockId, loading, error, interviews } = useSelector((state) => state.interview);

  useEffect(() => {
    dispatch(getAllInterviews());
  }, [dispatch]);

  useEffect(() => {
    if (mockId) {
      dispatch(getAllInterviews());
      onOpenChange(false);
    }
  }, [mockId]);

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(generateInterviewQuestions({
      jobPosition,
      jobDesc,
      jobExperience,
    }));
   
    setJobPosition('');
    setJobDesc('');
    setJobExperience('');
  };

  const handleDelete = (mockId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteInterview({ mockId }));
        Swal.fire(
          'Deleted!',
          'Your interview has been deleted.',
          'success'
        );
      }
    });
  };

  return (
    <div className="flex justify-center  min-h-screen ">
      <Card className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-lg mt-2">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">AI Mock Interviews</h1>
          <p className="text-gray-600 mt-2">Here are all the AI mock interviews you have created. You can create a new one or continue from any existing interview.</p>
        </div>

        {/* List of all interviews */}
        <div className="mb-8 space-y-4">
          {interviews && interviews.length > 0 ? (
            interviews.map((interview) => (
              <div key={interview.mockId} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Link to={`/ai/mockInterview/${interview.mockId}`} className="block col-span-3">
                  <div className="border  p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-gray-700">{interview.JobPosition}</h3>
                    <p className="text-gray-600">Job Description: {interview.JobDescription}</p>
                    <p className="text-gray-600">Experience: {interview.JobExperience} years</p>
                    <p className="text-gray-500 text-sm">Created on: {moment(interview.created_at).format('DD-MM-YYYY')}</p>
                  </div>
                </Link>
                <Button 
                  color="danger" 
                  variant="light" 
                  onPress={() => handleDelete(interview.mockId)} 
                  className=" col-span-1 my-auto hidden md:flex items-center gap-2 rounded-2xl border-b-4 border-red-500 bg-red-400 px-5 py-6 font-bold uppercase text-white hover:bg-red-800 hover:border-red-700 "
                >
                  Delete
                </Button>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No interviews found. Create your first one!</p>
          )}
        </div>

        {/* Button to create a new interview */}
        <div className="flex justify-center">
          <Button className=" hidden md:flex items-center gap-2 rounded-2xl border-b-4 border-blue-500 bg-blue-400 px-5 py-6 font-bold uppercase text-white transition hover:brightness-110"onPress={onOpen}>
            Create and start a new AI mock interview
          </Button>
        </div>

        {/* Modal for creating new interview */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <h2 className="font-bold text-2xl text-center">
                    Tell us more about your job interview
                  </h2>
                </ModalHeader>
                <ModalBody>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <h3 className="text-gray-700 mb-2">Job Position/Role</h3>
                      <Input
                        type="text"
                        label="Job Position"
                        value={jobPosition}
                        onChange={(e) => setJobPosition(e.target.value)}
                        placeholder="e.g., Software Engineer"
                        fullWidth
                        required
                      />
                    </div>
                    <div>
                      <Textarea
                        label="Job Description/Tech Stack"
                        labelPlacement="outside"
                        placeholder="e.g., React, Node.js, etc."
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                        fullWidth
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        min={0}
                        label="Years of Experience"
                        value={jobExperience}
                        onChange={(e) => setJobExperience(e.target.value)}
                        placeholder="e.g., 2"
                        fullWidth
                        required
                      />
                    </div>
                    <ModalFooter className="flex justify-between">
                      <Button color="danger" variant="light" onPress={onClose} className=" hidden md:flex items-center gap-2 rounded-2xl border-b-4 border-red-500 bg-red-400 px-5 py-6 font-bold uppercase text-white transition hover:brightness-110">
                        Close
                      </Button>
                      <Button color="primary" type="submit" disabled={loading} className=" hidden md:flex items-center gap-2 rounded-2xl border-b-4 border-green-500 bg-green-400 px-5 py-6 font-bold uppercase text-white transition hover:brightness-110">
                        {loading ? 'Generating...' : 'Create Mock Interview'}
                      </Button>
                    </ModalFooter>
                  </form>
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </Card>
    </div>
  );
};

export default AiMockInterview;