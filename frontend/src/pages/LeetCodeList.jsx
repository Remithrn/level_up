import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLeetcodeSubmissions, deleteLeetcodeSubmission } from '../features/LeetCode/LeetcodeSlice';
import { Card, CardHeader, CardBody, Link as NextUILink, Divider, Button } from '@nextui-org/react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import MyCard from '../Components/Card';
import Swal from 'sweetalert2';

const LeetCodeList = () => {
  const dispatch = useDispatch();
  const { submissions, loading, errorMessage } = useSelector((state) => state.leetcode);

  useEffect(() => {
    dispatch(getLeetcodeSubmissions());
  }, [dispatch]);

  // Function to handle delete action
  const handleDelete = (id) => {
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
        dispatch(deleteLeetcodeSubmission(id));
        Swal.fire(
          'Deleted!',
          'Your submission has been deleted.',
          'success'
        );
      }
    });
  };

  return (
    <MyCard>
      <div className="min-h-screen p-5">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">LeetCode Submissions</h1>

        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {errorMessage && <p className="text-center text-red-500">Error: {errorMessage}</p>}

        {!loading && !errorMessage && submissions && (
          <div className="flex flex-col space-y-5">
            {submissions.map((submission) => (
              <Card key={submission.id} className="p-5 shadow-lg rounded-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3 flex justify-between items-center">
                  <Link to={`/leetcode-submission/${submission.id}`} className="text-lg font-semibold text-blue-600 hover:underline">
                    {submission.question_title}
                  </Link>
                 {/* open  leetcode in a new tab */}
                  <Link to="https://leetcode.com/problemset/"  target="_blank" rel="noopener noreferrer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    strokeWidth={1.5}
                    className="size-6"
                    enable-background="new 0 0 24 24"
                    viewBox="0 0 24 24"
                    id="leetcode"
                  >
                    <path d="M22,14.355c0-0.742-0.564-1.346-1.26-1.346H10.676c-0.696,0-1.26,0.604-1.26,1.346s0.563,1.346,1.26,1.346H20.74C21.436,15.702,22,15.098,22,14.355z"></path>
                    <path d="M3.482,18.187l4.313,4.361C8.768,23.527,10.113,24,11.598,24c1.485,0,2.83-0.512,3.805-1.494l2.588-2.637c0.51-0.514,0.492-1.365-0.039-1.9c-0.531-0.535-1.375-0.553-1.884-0.039l-2.676,2.607c-0.462,0.467-1.102,0.662-1.809,0.662s-1.346-0.195-1.81-0.662l-4.298-4.363c-0.463-0.467-0.696-1.15-0.696-1.863c0-0.713,0.233-1.357,0.696-1.824l4.285-4.38c0.463-0.467,1.116-0.645,1.822-0.645s1.346,0.195,1.809,0.662l2.676,2.606c0.51,0.515,1.354,0.497,1.885-0.038c0.531-0.536,0.549-1.387,0.039-1.901l-2.588-2.636c-0.649-0.646-1.471-1.116-2.392-1.33l-0.034-0.007l2.447-2.503c0.512-0.514,0.494-1.366-0.037-1.901c-0.531-0.535-1.376-0.552-1.887-0.038L3.482,10.476C2.509,11.458,2,12.813,2,14.311C2,15.809,2.509,17.207,3.482,18.187z"></path>
                  </svg>
                  </Link>
                </CardHeader>
                <Divider />
                <CardBody className="pt-4 space-y-3 text-sm text-gray-700">
                  <p><span className="font-semibold">Question Number:</span> {submission.question_number}</p>
                  <p><span className="font-semibold">Language:</span> {submission.language}</p>
                  <p><span className="font-semibold">Submission Date:</span> {moment(submission.submission_date).format('MMMM Do YYYY')}</p>
                  <p><span className="font-semibold">Submission Time:</span> {moment(submission.submission_time, 'HH:mm:ss.SSS').format('h:mm A')}</p>
                  <NextUILink href={submission.question_link} target="_blank" className="text-blue-500 hover:underline">
                    View Question on LeetCode
                  </NextUILink>
                </CardBody>
                <div className="flex justify-end mt-3">
                  <Button
                    color="error"
                    className="btn-custom-red"
                    onClick={() => handleDelete(submission.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
        <div className="flex justify-center mt-8">
          <Link to="/leetcode-submission" className="text-center">
            <Button
              className="btn-custom-blue"
            >
              Submit New
            </Button>
          </Link>
        </div>
      </div>
    </MyCard>
  );
};

export default LeetCodeList;
