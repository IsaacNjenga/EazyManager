import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { UserContext } from "./context/userContext";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // Access setUser from UserContext

  const [data, setData] = useState({
    number: "",
    password: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    const { number, password } = data;

    try {
      const response = await axios.post("login", {
        number,
        password,
      });
      const { success, role, name } = response.data;

      if (success) {
        setUser({ role, name }); // Update user context with the role
        if (role === "admin") {
          navigate("/dashboard");
          toast.success(`Welcome ${name}`);
        } else {
          toast.success(`Welcome ${name}`);
          navigate("/add-sale");
        }
      } else {
        toast.error("Login failed.");
      }
    } catch (error) {
      console.error("Error during login", error);
      toast.error("An error occurred during login.");
    }
  };

  const signUp = () => {
    navigate("/register");
  };

  const back = () => {
    navigate("/");
  };

  return (
    <div id="main2">
      <div id="main-wrapper">
        <form className="form2" onSubmit={submit}>
          <button className="backbtn" onClick={back}>
            Back
          </button>
          <h1 style={{ textAlign: "center" }}>Login</h1>
          <label>
            <input
              className="input"
              type="text"
              onChange={(e) => setData({ ...data, number: e.target.value })}
            />
            <span>Sales ID</span>
          </label>
          <label>
            <input
              className="input"
              type="password"
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <span>Password</span>
          </label>
          <p>
            Don't have an account?{" "}
            <span
              onClick={signUp}
              style={{
                color: "blue",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Sign up!
            </span>
          </p>
          <button className="loginbtn" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
