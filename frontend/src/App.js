import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import LawyerLoginPage from "./components/LawyerHomePage";
import VictimLoginPage from "./components/VictimHomePage";
import VictimSignupPage from "./components/VictimSignupPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/lawyer" element={<LawyerLoginPage />} />
        <Route path="/victim" element={<VictimLoginPage />} />
        <Route path="/victim-signup" element={<VictimSignupPage />} />
      </Routes>
    </Router>
  );
};

export default App;