import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    number: "",
    password: "",
    role: "",
  });

  const validateForm = ({ name, number, password, role }) => {
    const nameRegex = /^[A-Za-z]+$/;
    if (!name.trim()) return "Name is required";
    if (!nameRegex.test(name)) {
      return "Name should contain only letters";
    }
    if (!role.trim()) return "Role is required";
    if (!number.trim()) return "Sales ID is required";
    if (!/^\d+$/.test(number)) return "Sales ID must contain only numbers";
    if (!password || password.length < 6)
      return "Password should be at least 6 characters long";
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();

    const { name, number, password, role } = data;
    const error = validateForm({ name, number, password, role });

    if (error) {
      toast.error(error);
      return;
    }

    try {
      const { data } = await axios.post(
        "register",
        {
          name,
          number,
          password,
          role,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (data.error) {
        data.error.forEach((err) => {
          toast.error(err.msg);
        });
      } else {
        setData({ data });
        toast.success("Registration was successful. Proceed to Sign In!");
        navigate("/login");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("There was an error. Please refresh and try again.");
    }
  };

  /*const signIn = () => {
    navigate("/login");
  };*/

  const back = () => {
    navigate("/dashboard");
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div id="main22">
      <div id="main-wrapper">
        <form className="form2" onSubmit={submit}>
          <button className="backbtn" onClick={back}>
            Back
          </button>
          <h1 style={{ textAlign: "center" }}>Add A User Account</h1>
          <label>
            <input
              className="input"
              type="text"
              value={data.name}
              onChange={(e) => {
                const newValue = capitalizeFirstLetter(e.target.value);
                setData({ ...data, name: newValue });
              }}
            />
            <span>Name</span>
          </label>
          <label>
            <input
              className="input"
              type="text"
              value={data.number}
              onChange={(e) => setData({ ...data, number: e.target.value })}
            />
            <span>Sales ID</span>
          </label>
          <label>
            <span>Role</span>
            <select
              className="select"
              value={data.role}
              onChange={(e) => setData({ ...data, role: e.target.value })}
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="admin">Admin</option>
              <option value="salesperson">Salesperson</option>
            </select>
          </label>

          <label>
            <input
              className="input"
              type="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <span>Password</span>
          </label>
          {/*<p>
            Already have an account?{" "}
            <span
              onClick={signIn}
              style={{
                color: "blue",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Sign in
            </span>
            </p>*/}
          <button className="button" type="submit">
            Create User Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
