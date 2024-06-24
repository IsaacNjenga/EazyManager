import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { UserContext } from "./context/userContext";

function Login() {
  const navigate = useNavigate();
  const { setUser, setLoggedIn } = useContext(UserContext);
  const [loading, setLoading] = useState(false); // Set initial loading state to false
  const [showAnimation, setShowAnimation] = useState(false);

  const [data, setData] = useState({
    number: "",
    password: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    const { number, password } = data;
    setLoading(true);
    setShowAnimation(true);

    try {
      const response = await axios.post(`login`, { number, password });

      const { success, role, name } = response.data;

      if (success) {
        const profileResponse = await axios.get(`profile`);

        if (profileResponse.data) {
          setUser(profileResponse.data);
          console.log(profileResponse.data);
          setLoggedIn(true);
          toast.success(`Welcome ${name}`);

          if (role === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/add-sale");
          }
        } else {
          toast.error("Failed to fetch profile.");
        }
      } else {
        toast.error("Login failed.");
      }
    } catch (error) {
      console.error("Error during login", error);
      toast.error("An error occurred during login.");
    } finally {
      setLoading(false);
      setShowAnimation(false);
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
        {loading && (
          <div className="hourglassOverlay">
            <div className="hourglassBackground">
              <div className="hourglassContainer">
                <div className="hourglassCurves"></div>
                <div className="hourglassCapTop"></div>
                <div className="hourglassGlassTop"></div>
                <div className="hourglassSand"></div>
                <div className="hourglassSandStream"></div>
                <div className="hourglassCapBottom"></div>
                <div className="hourglassGlass"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
