import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import Layout from "./HOC/Layout";
import ProtectedRoutes from "./HOC/ProtectedRoutes";

// Lazy load the pages
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const EmailVerification = lazy(() => import("./pages/EmailVerification"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ResetPasswordConfirm = lazy(() => import("./pages/ResetPasswordConfirm"));
const Signup = lazy(() => import("./pages/Signup"));
const AiMockInterview = lazy(() => import("./pages/AiMockInterview"));
const TestPage = lazy(() => import("./pages/TestPage"));
const UsersProfile = lazy(() => import("./pages/UsersProfile"));
const InterviewStart = lazy(() => import("./pages/InterviewStart"));
const AiinterviewFeedback = lazy(() => import("./pages/AiinterviewFeedback"));
const Inbox = lazy(() => import("./pages/Inbox"));
const Chats = lazy(() => import("./pages/Chats"));
const GroupChats = lazy(() => import("./pages/GroupChats"));
const GroupMessages = lazy(() => import("./pages/GroupMessages"));
const GroupSettings = lazy(() => import("./pages/GroupSettings"));
const LeetcodeSubmission = lazy(() => import("./pages/LeetcodeSubmission"));
const LeetCodeList = lazy(() => import("./pages/LeetCodeList"));
const LeetCodedetails = lazy(() => import("./pages/LeetCodedetails"));
const Profile = lazy(() => import("./pages/Profile"));
const AiQuizCreation = lazy(() => import("./pages/AiQuizCreation"));
const AiQuizStart = lazy(() => import("./pages/AiQuizStart"));
const AiQuizScore = lazy(() => import("./pages/AiQuizScore"));
const AiQuiz = lazy(() => import("./pages/AiQuiz"));
const Payment = lazy(() => import("./pages/Payment"));
import { AdminDashboard } from "./pages/adminDashboard";
import LeaderBoard from "./pages/LeaderBoard";
import AddBadges from "./pages/AddBadges";
import AIChatBot from "./pages/AIChatBot";
import Badges from "./pages/Badges";
import Subscribers from "./pages/Subscribers";
const AdminLogin = lazy(() => import("./pages/AdminLogin"));

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route exact path="/test" Component={Home}></Route>
            <Route exact path="login/" Component={Login}></Route>
            <Route exact path="signup/" Component={Signup}></Route>
            <Route path="/" Component={TestPage}></Route>
            <Route
              exact
              path="change/password"
              Component={ChangePassword}
            ></Route>
            <Route
              exact
              path="reset/password"
              Component={ResetPassword}
            ></Route>
            <Route
              path="dj-rest-auth/registration/account-confirm-email/:key/"
              Component={EmailVerification}
            ></Route>
            <Route
              path="reset/password/confirm/:uid/:token"
              Component={ResetPasswordConfirm}
            ></Route>
            <Route path="profile/" Component={Profile}></Route>

            <Route path="ai/interview/" element={<ProtectedRoutes>
              <AiMockInterview />
            </ProtectedRoutes>}></Route>
            <Route path="ai/mockInterview/:mockId/" Component={InterviewStart}></Route>
            <Route path="profile/:id/" element={<ProtectedRoutes>

              <UsersProfile />
            </ProtectedRoutes>
            }>

            </Route>
            <Route path="payment/" Component={Payment}></Route>

            <Route path="ai/feedback/:mockId/" element={
              <ProtectedRoutes>

                <AiinterviewFeedback />
              </ProtectedRoutes>
            }></Route>
            <Route path="inbox/" element={
              <ProtectedRoutes>

                <Inbox />
              </ProtectedRoutes>

            }></Route>
            <Route path="chats/:id" element={
              <ProtectedRoutes>

                <Chats />
              </ProtectedRoutes>

            }></Route>
            <Route path="group-chat/" Component={GroupChats}></Route>
            <Route path="group-chat/:id" Component={GroupMessages}></Route>
            <Route path="group-chat/:id/settings" Component={GroupSettings}></Route>
            <Route path="leetcode-submission/" Component={LeetcodeSubmission}></Route>
            <Route path="leetcode-submission/list" Component={LeetCodeList}></Route>
            <Route path="leetcode-submission/:id" Component={LeetCodedetails}></Route>
            <Route path="ai/quiz" Component={AiQuizCreation}></Route>
            <Route path="ai/quiz/start/" Component={AiQuizStart}></Route>
            <Route path="ai/quiz/score/:id" Component={AiQuizScore}></Route>
            <Route path="ai/quiz/start/:id" Component={AiQuiz}></Route>
            <Route path="admin/dashboard/" Component={AdminDashboard}></Route>
            <Route path="admin/login/" Component={AdminLogin}></Route>
            <Route path="admin/add-badges/" element={<ProtectedRoutes>
              <AddBadges/>
            </ProtectedRoutes>}></Route>
            <Route path="admin/badges/" element={
              <ProtectedRoutes>
                <Badges/>
              </ProtectedRoutes>
            }></Route>
            <Route path="/admin/subscribers/" element={
              <ProtectedRoutes>
                <Subscribers/>
              </ProtectedRoutes>
            }></Route>
            <Route path="leaderboard/" element={<ProtectedRoutes>
              <LeaderBoard />
            </ProtectedRoutes>
            }>
            </Route>
            <Route path="/ai-chatbot/" element={<ProtectedRoutes>
              <AIChatBot/>
              </ProtectedRoutes>
            }></Route>

          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;