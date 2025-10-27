import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import LandingPage from "./components/pages/LandingPage/LandingPage";
import NotFound from "./components/pages/NotFound";
import LoginPage from "./components/pages/LoginPage/LoginPage";
import LoginOTP from "./components/pages/LoginPage/LoginOTP.jsx";
import RegisterPage from "./components/pages/RegisterPage/RegisterPage";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import RegSuccess from "./components/pages/RegisterPage/RegSuccess";
import MemStepOne from "./components/flows/MemberProfileFlow/MemStepOne";
import MemStepTwo from "./components/flows/MemberProfileFlow/MemStepTwo";
import MemStepThree from "./components/flows/MemberProfileFlow/MemStepThree";
import MemStepFour from "./components/flows/MemberProfileFlow/MemStepFour";
import MemStepFive from "./components/flows/MemberProfileFlow/MemStepFive";
import MemStepSix from "./components/flows/MemberProfileFlow/MemStepSix";
import MemStepPayment from "./components/flows/MemberProfileFlow/MemStepPayment";
import DashboardAdmin from "./components/pages/Dashboard/DashbordAdmin";
import AgentStepOne from "./components/flows/AgentProfileFlowed/AgentStepOne";
import AgentStepTwo from "./components/flows/AgentProfileFlowed/AgentStepTwo";
import AgentStepThree from "./components/flows/AgentProfileFlowed/AgentStepThree";
import AgentStepFour from "./components/flows/AgentProfileFlowed/AgentStepFour";
import AgentStepFive from "./components/flows/AgentProfileFlowed/AgentStepFive";
import AgentStepSix from "./components/flows/AgentProfileFlowed/AgentStepSix";
import AgentStepSeven from "./components/flows/AgentProfileFlowed/AgentStepSeven";
import AgentStepPayment from "./components/flows/AgentProfileFlowed/AgentStepPayment";
import MemProfile from "./components/pages/MemProfile/MemProfile";
import Settings from "./components/pages/Settings/Settings";
import UserProfile from "./components/UserProfile";
import NewDashboard from "./components/Dashboard/NewDashboard";
import UserDashboard from "./components/Dashboard/UserDashboard/UserDashboard";
import MyMembers from "./components/Dashboard/MyMembers/MyMembers";
import TotalInteraction from "./components/Dashboard/TotalInteraction/TotalInteraction";
import TotalInterest from "./components/Dashboard/TotalInterest/TotalInterest";
import TotalIgnoredList from "./components/Dashboard/TotalIgnoredList/TotalIgnoredList";
import Matches from "./components/Dashboard/Matches/Matches";
import ManageProfile from "./components/Dashboard/ManageProfile/ManageProfile";
import Totalrequest from "./components/Dashboard/Totalrequest/Totalrequest";
import Totalshortlist from "./components/Dashboard/Totalshortlist/Totalshortlist";
import Totalblocked from "./components/Dashboard/Totalblocked/Totalblocked";
import TotalBlockedAgent from "./components/Dashboard/Totalblocked/TotalBlockedAgent";
import PremiumPlans from "./components/Dashboard/Premiums/PremiumPlans";
import Inbox from "./components/Dashboard/Inbox/Inbox";
import TermsCondition from "./components/Dashboard/TermsCondition/TermsCondition";
import TermsConditions from "./components/pages/TermsConditions/TermsConditions";

import UserDetail from "./components/UserDetail/UserDetail";
import MyProfile from "./components/UserDetail/MyProfile";
import AgentProfile from "./components/Dashboard/AgentProfile/AgentProfile";
import MyInterest from "./components/Dashboard/dashboardCard/MyInterest/Myinterest";
import MyShortlist from "./components/Dashboard/dashboardCard/MyShortList/MyShortlist";
import TotalShortlistAgent from "./components/Dashboard/TotalShortlistAgent/TotalShortlistAgent";
import TotalInteractionAgent from "./components/Dashboard/TotalInteractionAgent/TotalInteractionAgent";
import ChangePassword from "./components/Dashboard/UserDashboard/ChangePassword.jsx";
import Landingpage from "./components/Guidance/Landingpage.tsx";
import BlogPage from "./components/Guidance/Blogpage/BlogPage.tsx";
import ViewAllTrendingProfiles from "./components/Dashboard/ViewAll/ViewAllTrendingProfiles.jsx";
import ViewAllRecommendedProfiles from "./components/Dashboard/ViewAll/ViewAllRecommendedProfiles.jsx";
import ViewAllUser from "./components/Dashboard/ViewAll/ViewAllUser.jsx";
import AboutUs from "./components/pages/AboutUs/AboutUs";
import ContactUs from "./components/pages/ContactUs/ContactUs";
import PrivacyPolicy from "./components/pages/PrivacyPolicy/PrivacyPolicy";
import MemberAnalytics from "./components/Dashboard/MemberAnalytics/MemberAnalytics";
import MemberMatches from "./components/Dashboard/MemberMatches/MemberMatches";
import MemberInterest from "./components/Dashboard/MemberInterest/MemberInterest";
import MemberRequests from "./components/Dashboard/MemberRequests/MemberRequests";
import Member_Interest from "./components/Dashboard/AgentActions/Member_Interest";
import MemberInterests from "./components/Dashboard/MemberInterests/MemberInterests";
import MemberRequestSend_Received from "./components/Dashboard/AgentActions/MemberRequestSend_Received";

const AllRoutes = () => {
  const token = localStorage.getItem("token");

  if (token && token.split(".").length === 3) {
    try {
      const decoded = jwtDecode(token);
      console.log("decoded : ", decoded.user_id, decoded);
      const userId = decoded.user_id || decoded.id || "";
      
      // Check if we're impersonating a user
      const isImpersonating = localStorage.getItem('is_agent_impersonating') === 'true';
      const impersonatingUserId = localStorage.getItem('impersonating_user_id');
      
      if (isImpersonating && impersonatingUserId) {
        // Use the impersonated user's ID
        localStorage.setItem("userId", impersonatingUserId);
        console.log("Using impersonated user ID:", impersonatingUserId);
      } else {
        // Use the actual user's ID from token
        localStorage.setItem("userId", userId);
      }
      
      localStorage.setItem("user", JSON.stringify(decoded));
    } catch (err) {
      console.error("Token decoding failed:", err);
      localStorage.removeItem("token"); // Optionally clear the invalid token
    }
  } else {
    console.warn("Invalid or missing token in localStorage");
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/agent" element={<LandingPage />} />
        <Route path="/individual" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/login-otp" element={<LoginOTP />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/sucregister" element={<RegSuccess />} />

        {/* Protect the dashboard route */}
        <Route
          path="/newdashboard"
          element={
            <PrivateRoute>
              {" "}
              <NewDashboard />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/viewalltrendingprofiles"
          element={
            <PrivateRoute>
              {" "}
              <ViewAllTrendingProfiles />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/viewallrecommendedprofiles"
          element={
            <PrivateRoute>
              {" "}
              <ViewAllRecommendedProfiles />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/viewalluser"
          element={
            <PrivateRoute>
              {" "}
              <ViewAllUser />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/newdashboard/interest"
          element={
            <PrivateRoute>
              {" "}
              <MyInterest />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/newdashboard/shortlist"
          element={
            <PrivateRoute>
              {" "}
              <MyShortlist />{" "}
            </PrivateRoute>
          }
        />

        <Route
          path="/details/:userId"
          element={
            <PrivateRoute>
              {" "}
              <UserDetail />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/myprofile/:userId"
          element={
            <PrivateRoute>
              {" "}
              <MyProfile />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/agent-profile/:agentId"
          element={
            <PrivateRoute>
              {" "}
              <AgentProfile />{" "}
            </PrivateRoute>
          }
        />

        <Route
          path="/user-dashboard"
          element={
            <PrivateRoute>
              {" "}
              <UserDashboard />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/my-memberss"
          element={
            <PrivateRoute>
              {" "}
              <MyMembers />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/total-interaction"
          element={
            <PrivateRoute>
              {" "}
              <TotalInteraction />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/total-interest"
          element={
            <PrivateRoute>
              {" "}
              <TotalInterest />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/total-ignored"
          element={
            <PrivateRoute>
              {" "}
              <TotalIgnoredList />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/matches"
          element={
            <PrivateRoute>
              {" "}
              <Matches />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-profile"
          element={
            <PrivateRoute>
              {" "}
              <ManageProfile />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/total-request"
          element={
            <PrivateRoute>
              {" "}
              <Totalrequest />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/total-shortlist"
          element={
            <PrivateRoute>
              {" "}
              <Totalshortlist />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/total-shortlist-agent"
          element={
            <PrivateRoute>
              {" "}
              <TotalShortlistAgent />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/total-interaction-agent"
          element={
            <PrivateRoute>
              {" "}
              <TotalInteractionAgent />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/blocked-list"
          element={
            <PrivateRoute>
              {" "}
              <Totalblocked />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/total-blocked"
          element={
            <PrivateRoute>
              {" "}
              <TotalBlockedAgent />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/premium"
          element={
            <PrivateRoute>
              {" "}
              <PremiumPlans />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/guidance"
          element={
              <Landingpage />
          }
        />
        <Route
          path="/blogpage"
          element={
              <BlogPage />
          }
        />
        <Route
          path="/:userId/inbox/"
          element={
            <PrivateRoute>
              {" "}
              <Inbox />{" "}
            </PrivateRoute>
          }
        />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route
          path="/member-analytics"
          element={
            <PrivateRoute>
              <MemberAnalytics />
            </PrivateRoute>
          }
        />
        <Route
          path="/member-matches/:memberId"
          element={
            <PrivateRoute>
              <MemberMatches />
            </PrivateRoute>
          }
        />
        <Route
          path="/member-interest"
          element={
            <PrivateRoute>
              <MemberInterest />
            </PrivateRoute>
          }
        />
        <Route
          path="/member-request"
          element={
            <PrivateRoute>
              <MemberRequests />
            </PrivateRoute>
          }
        />
        <Route
          path="/member-interest-agent"
          element={
            <PrivateRoute>
              <Member_Interest />
            </PrivateRoute>
          }
        />
        <Route
          path="/member-interests/:memberId"
          element={
            <PrivateRoute>
              <MemberInterests />
            </PrivateRoute>
          }
        />
        <Route
          path="/member-request-send-received"
          element={
            <PrivateRoute>
              <MemberRequestSend_Received />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              {" "}
              <Dashboard />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/agent"
          element={
            <PrivateRoute>
              {" "}
              <Dashboard />{" "}
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/:userId"
          element={
            <PrivateRoute>
              {" "}
              <MemProfile />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/users/:userId"
          element={
            <PrivateRoute>
              {" "}
              <UserProfile />{" "}
            </PrivateRoute>
          }
        />

        <Route
          path="/memsteptwo"
          element={
            <PrivateRoute>
              <MemStepTwo />
            </PrivateRoute>
          }
        />
        <Route
          path="/memstepthree"
          element={
            <PrivateRoute>
              <MemStepThree />
            </PrivateRoute>
          }
        />
        <Route
          path="/memstepfour"
          element={
            <PrivateRoute>
              <MemStepFour />
            </PrivateRoute>
          }
        />
        <Route
          path="/memstepfive/"
          element={
            <PrivateRoute>
              <MemStepFive />
            </PrivateRoute>
          }
        />
        <Route
          path="/memstepsix/:userId"
          element={
            <PrivateRoute>
              <MemStepSix />
            </PrivateRoute>
          }
        />
        <Route
          path="/manageprofile/:userId"
          element={
            <PrivateRoute>
              <MemStepSix />
            </PrivateRoute>
          }
        />
        <Route
          path="/memstep-payment/:userId"
          element={
            <PrivateRoute>
              <MemStepPayment />
            </PrivateRoute>
          }
        />

        <Route path="/memstepone/:userId" element={<PrivateRoute><MemStepOne/></PrivateRoute>  }/>
        <Route path="/memsteptwo/:userId" element={ <PrivateRoute><MemStepTwo/> </PrivateRoute>}/>
        <Route path="/memstepthree/:userId" element={<PrivateRoute> <MemStepThree/></PrivateRoute> }/>
        <Route path="/memstepfour/:userId" element={ <PrivateRoute><MemStepFour/> </PrivateRoute>}/>
        <Route path="/memstepfive/:userId" element={<PrivateRoute> <MemStepFive/></PrivateRoute> }/>
        <Route path="/memstepsix/:userId" element={ <PrivateRoute><MemStepSix/> </PrivateRoute>}/>
        <Route path="/memstep-payment/:userId" element={<PrivateRoute> <MemStepPayment/> </PrivateRoute>}/>
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              {" "}
              <DashboardAdmin />{" "}
            </PrivateRoute>
          }
        />

        <Route
          path="/agentstepone/:agentId"
          element={
            <PrivateRoute>
              <AgentStepOne />
            </PrivateRoute>
          }
        />
        <Route
          path="/agentsteptwo/:agentId"
          element={
            <PrivateRoute>
              <AgentStepTwo />
            </PrivateRoute>
          }
        />
        <Route
          path="/agentstepthr/:agentId"
          element={
            <PrivateRoute>
              <AgentStepThree />
            </PrivateRoute>
          }
        />
        <Route
          path="/agentstepfou/:agentId"
          element={
            <PrivateRoute>
              <AgentStepFour />
            </PrivateRoute>
          }
        />
        <Route
          path="/agentstepfiv/:agentId"
          element={
            <PrivateRoute>
              <AgentStepFive />
            </PrivateRoute>
          }
        />
        <Route
          path="/agentstepsix/:agentId"
          element={
            <PrivateRoute>
              <AgentStepSix />
            </PrivateRoute>
          }
        />
        <Route
          path="/agentstepseven/:agentId"
          element={
            <PrivateRoute>
              <AgentStepSeven />
            </PrivateRoute>
          }
        />
        <Route
          path="/agentstep-pa/:agentId"
          element={
            <PrivateRoute>
              <AgentStepPayment />
            </PrivateRoute>
          }
        />

        <Route
          path="/memprofile"
          element={
            <PrivateRoute>
              <MemProfile />
            </PrivateRoute>
          }
        />

        <Route path="/settings" element={<Settings />} />

        <Route path="/:userId/changepassword" element={<ChangePassword />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AllRoutes;
