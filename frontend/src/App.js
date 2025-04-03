import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import LawyerLoginPage from "./components/LawyerLoginPage";
import LawyerSignupPage from "./components/LawyerSignupPage";
import VictimLoginPage from "./components/VictimLoginPage";
import LawyerDashBoard from "./components/LawyerDashBoard";
import ExploreCases from "./components/ExploreCases";
import VictimSignupPage from "./components/VictimSignupPage";
import VictimDashBoard from "./components/VictimDashBoard";
import CreateCase from "./components/CreateCase";
import Admin from "./components/Admin";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/lawyer" element={<LawyerLoginPage />} />
        <Route path="/lawyer-signup" element={<LawyerSignupPage />} />
        <Route path="/lawyer-dashboard" element={<LawyerDashBoard />} />
        <Route path="/explore-cases" element={<ExploreCases />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/victim" element={<VictimLoginPage />} />
        <Route path="/victim-signup" element={<VictimSignupPage />} />
        <Route path="/victim-dashboard" element={<VictimDashBoard />} />
        <Route path="/create-case" element={<CreateCase />} />
      </Routes>
    </Router>
  );
};

export default App;