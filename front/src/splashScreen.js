import React from "react";
import { Routes, Route } from "react-router-dom";
import Welcome from "./welcome";
import Login from "./Login";
import Register from "./Register";
import Sales from "./sales";

function SplashScreen() {
  return (
    <div>
      <Routes>
        <Route path="*" element={<Welcome />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default SplashScreen;
