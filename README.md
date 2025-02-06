Below is the updated README that includes details about the chatbot feature and a link to the frontend repository.

---

# Level Up Backend

**Level Up** is an AI-powered interactive platform designed to elevate the learning experience through gamification, social interaction, and AI-driven challenges. This repository contains the backend portion of the application, built with Django, which supports features such as user management, daily challenges, chat/group interactions, and an in-app chatbot. The frontend is maintained in a separate repository.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technical Stack & Architecture](#technical-stack--architecture)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Testing](#testing)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)
- [Project Presentation Script](#project-presentation-script)
- [Contact Information](#contact-information)

---

## Overview

The backend of **Level Up** handles core functionalities including secure user authentication, management of daily challenges, and processing of background tasks using Celery. Additionally, it supports social interactions through chat features and includes an in-app chatbot that assists users during their learning journey. The frontend, which delivers the user interface and interactive experience, is available in a separate repository.

---

## Features

- **User Management:**

  - Secure registration and login.
  - User profile management.

- **Daily Challenges & Gamification:**

  - **Leetcode Challenges:** Users can submit one Leetcode problem daily.
  - **AI Quiz:** Users can take AI-generated quizzes on various topics.
  - **AI Interview Practice:** Users practice interviews with dynamically generated questions and speech-to-text feedback.
  - **Streaks & Badges:** Earn experience points (EXP) and badges for completing daily tasks.

- **Social Interaction:**

  - One-on-one and group chats.
  - Friend and group management.
  - **Chatbot Feature:** An in-app chatbot is available to help users navigate challenges, answer queries, and provide support during their learning journey.

- **Background Tasks:**

  - Asynchronous task processing using Celery (e.g., sending email reminders).

- **Containerization:**

  - Dockerized backend for ease of deployment and scalability.

- **Frontend Link:**
  - The user interface is maintained in a separate repository. [View the Frontend Repository](https://github.com/yourusername/levelup-frontend)

---

## Technical Stack & Architecture

- **Backend Framework:** Django
- **Asynchronous Task Queue:** Celery
- **Containerization:** Docker & Docker Compose

**Architecture Overview:**

1. **API Endpoints:** Django handles RESTful API endpoints to serve data to the frontend.
2. **Background Processing:** Celery manages scheduled tasks, such as email reminders.
3. **Chatbot Integration:** The backend supports an in-app chatbot that provides real-time assistance to users.
4. **Deployment:** Docker and Docker Compose ensure a consistent environment across development, testing, and production.

---

## Setup and Installation

Follow these steps to set up and run the backend locally:

### Prerequisites

- **Docker & Docker Compose:** Ensure Docker is installed and running on your system.
- **.env File:** Create a `.env` file in the root directory to store environment variables (e.g., database credentials, Django secret key).

### Installation Steps

1. **Create the `.env` File:**

   Create a file named `.env` in the root of the project and also in the backend. Configure it with the necessary environment variables. For example in the root add:

   ```env
    DB_NAME=your_db_name
    DB_USER=your_user
    DB_PASSWORD=your_password
   ```

   in the backend add this .env:

```.env
    SECRET_KEY =YOUR_SECRET_KEY
    DEBUG =True
    EMAIL_HOST_USER =your_email
    EMAIL_HOST_PASSWORD =your_email_password
    GOOGLES_API_KEY=your_google_api_key_for_gemni
    RAZORPAY_KEY_ID=your_razorpay_id
    RAZORPAY_KEY_SECRET=your_razorpay_key
    DB_NAME=your_db_name
    DB_USER=your_user
    DB_PASSWORD=your_password

```

```

```

2. **Build the Docker Containers:**

   In your project root (where your `docker-compose.yml` file is located), run:

   ```bash
   docker-compose build
   ```

3. **Start the Docker Containers:**

   After building, start the containers with:

   ```bash
   docker-compose up
   ```

4. **Apply Database Migrations and Create a Superuser:**

   Once the containers are up, execute the following commands within the running backend container:

   ```bash
   docker-compose exec backend python manage.py migrate
   docker-compose exec backend python manage.py createsuperuser
   ```

   Follow the prompts to set up your superuser account.

---

## Usage

- **Access the API:**  
  The backend is running on the configured port (typically [http://localhost:8000](http://localhost:8000)).

- **Django Admin:**  
  Log into the Django admin panel at [http://localhost:8000/admin](http://localhost:8000/admin) using the superuser credentials to manage application data.

- **Chatbot Feature:**  
  The in-app chatbot, powered by backend integrations, is available to help users with guidance and support throughout the platform.

- **Celery Tasks:**  
  Background tasks such as sending email reminders are automatically handled by Celery as part of the Docker Compose setup.

- **Frontend:**  
  For the interactive user interface, please refer to our separate [Frontend Repository](https://github.com/Remithrn/level_up_frontend).

## Deployment

- **Dockerized Deployment:**  
  The backend is fully containerized. Use Docker Compose for a multi-container deployment. Ensure that environment variables are properly set for production.
- **Scalability:**  
  For production environments, consider optimizing Django, Celery, and message broker configurations to handle increased loads.

---

## Future Enhancements

- **Enhanced AI Personalization:**  
  Develop more personalized AI-driven features to tailor learning experiences.
- **Advanced Gamification:**  
  Introduce additional reward systems and challenges to further motivate users.
- **Scalability Improvements:**  
  Optimize deployment and backend performance for a larger user base.

---

## Project Presentation Script

### Introduction

> "Hello, I’m [Remith R Nair], and today I’m excited to present the backend of Level Up—an AI-powered interactive platform that combines gamified learning with social networking. Our robust backend, built with Django and containerized using Docker, supports everything from user management and daily challenges to real-time chatbot assistance."

### Project Overview

> "The backend of Level Up is designed to handle critical functionalities including secure user authentication, daily tasks like Leetcode challenges and AI quizzes, and even an in-app chatbot to assist users during their learning journey. All these are powered by a robust Django framework and streamlined with Docker and Celery for background task processing."

### Key Features Discussion

- **User Management & Security:**
  > "We ensure robust user authentication and secure data management, complemented by an admin interface for ease of administration."
- **Daily Challenges & Gamification:**
  > "Users engage in daily challenges that help them earn EXP and badges, fostering consistent learning and friendly competition."
- **Chatbot Assistance:**
  > "Our in-app chatbot provides real-time assistance, helping users navigate the platform, answer queries, and stay on track with their learning goals."
- **Asynchronous Processing & Deployment:**
  > "Celery handles background tasks like sending email reminders, and our Dockerized setup ensures consistent and scalable deployment across environments."

### Challenges and Solutions

> "One key challenge was integrating a reliable chatbot that could provide timely assistance without overloading the system. By leveraging efficient backend integrations and Docker configurations, we ensured seamless operation and scalability. Additionally, managing migrations and background tasks required careful setup, which we achieved through Docker Compose and Celery."

### Conclusion and Future Directions

> "In conclusion, the backend of Level Up is a robust, scalable solution that powers a feature-rich interactive learning platform. Our future plans include enhancing AI personalization and expanding gamification features to further enrich user experiences."

### Q&A

> "Thank you for your time. I’m happy to answer any questions you may have about the backend architecture, chatbot integration, or any of the technologies we used."

---

## Contact Information

- **Email:** [nair.remith@gmail.com]
- **GitHub:** [GitHubProfile](https://github.com/Remithrn)
- **LinkedIn:** [LinkedInProfile](https://www.linkedin.com/in/remith-r-nair-/)

---
