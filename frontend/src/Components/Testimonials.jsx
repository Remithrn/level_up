

import React from "react";
import { InfiniteMovingCards } from "../Components/ui/infinite-moving-component";

export function InfiniteMovingCardsDemo() {
  return (
    
    (<div
      className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <div className="text-3xl md:text-7xl font-bold dark:text-white text-center mb-2">Testimonials</div>
      <InfiniteMovingCards items={testimonials} direction="right" speed="slow" />
    </div>)
  );
}

const testimonials = [
    {
      quote: "Level Up has transformed the way I approach my studies. The AI mock interviews are a game changer!",
      name: "Alex Johnson",
      title: "Student",
    },
    {
      quote: "The streaks feature keeps me motivated. It's exactly what I needed to stay on track with my learning goals.",
      name: "Jordan Lee",
      title: "Professional Developer",
    },
    {
      quote: "I love the social aspects of Level Up. Being able to connect with other learners has been a huge boost.",
      name: "Sam Taylor",
      title: "Engineering Student",
    },
    {
      quote: "The daily quizzes and LeetCode reminders are incredibly helpful for maintaining a regular study routine.",
      name: "Morgan Kim",
      title: "Software Engineer",
    },
    {
      quote: "Level Up's user-friendly interface and effective learning tools have made studying more enjoyable.",
      name: "Riley Martinez",
      title: "Computer Science Major",
    },
  ];