import React from "react";
import { Link } from "react-router-dom";

function Welcome() {
  return (
    <div className="sign-page">
      <br />

      <br />

      <div className="name-styling">
        <span
          style={{ fontSize: "55px", color: "indigo", fontStyle: "italic" }}
        >
          Easy
        </span>

        <span style={{ fontSize: "55px", color: "red", fontWeight: "bold" }}>
          Manager
        </span>
      </div>

      <br />

      <div className="sign-in-page-div">
        <div className="signin-div">
          <h1 style={{ color: "white", fontSize:"250%" }}>Welcome Back!</h1>

          <p style={{ color: "white" }}>
            To keep connected, please log in with your personal info!
          </p>

          <Link to="/login" className="button">
            Login
          </Link>
        </div>

        <div className="signup-div">
          <h1 style={{ color: "white", fontSize:"250%" }}>New User?</h1>

          <p style={{ color: "white" }}>
            To get started with EasyManager, sign up!
          </p>

          <Link to="/register" className="button">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
