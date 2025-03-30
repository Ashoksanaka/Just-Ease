import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import LawyerLoginPage from "./components/LawyerHomePage";
import VictimLoginPage from "./components/VictimLoginPage";
import VictimSignupPage from "./components/VictimSignupPage";
import VictimDashBoard from "./components/VictimDashBoard";
import CreateCase from "./components/CreateCase";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/lawyer" element={<LawyerLoginPage />} />
        <Route path="/victim" element={<VictimLoginPage />} />
        <Route path="/victim-signup" element={<VictimSignupPage />} />
        <Route path="/victim-dashboard" element={<VictimDashBoard />} />
        <Route path="/create-case" element={<CreateCase />} />
      </Routes>
    </Router>
  );
};

export default App;