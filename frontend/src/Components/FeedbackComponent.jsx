import React from "react";
import Card from "./Card";
import ReactMarkdown from "react-markdown";

const FeedbackComponent = ({ feedbacks }) => {
  const feedbackContent = feedbacks ? String(feedbacks) : "";

  return (
    <Card>
      <div className="p-8  text-left">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">Feedbacks</h1>
        <div className="space-y-6">
          {feedbackContent ? (
            <ReactMarkdown className="prose max-w-none text-gray-700 leading-relaxed">
              {feedbackContent}
            </ReactMarkdown>
          ) : (
            <p className="text-gray-500 italic">No feedback available.</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default FeedbackComponent;
