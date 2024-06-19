import React, { useState, useEffect, useContext, Fragment } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function Navbar() {
  const { user, setUser, isAuthenticated, setIsAuthenticated } =
    useContext(UserContext);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    }
  }, [user, setIsAuthenticated]);

  const formattedDate = currentDateTime.toLocaleDateString("en-UK", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = currentDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const dateTimeStyle = {
    position: "absolute",
    top: 0,
    right: 0,
    padding: "20px",
    fontWeight: "bolder",
  };

  const linkStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textDecoration: "none",
    color: "white",
    fontSize: "17px",
    padding: "10%",
    transition: "all 0.3s ease",
    borderRadius: "5px",
  };

  const handleLogout = async () => {
    try {
      await axios.get("/logout");
      setIsAuthenticated(false);
      toast.success("Logged out");
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const tryToAccess = () => {
    if (user.role !== "admin") {
      toast.error("You are not authorised");
    }
  };

  return (
    <Fragment>
      {isAuthenticated ? (
        <nav style={{ display: "flex" }}>
          <div id="timenav" className="time" style={dateTimeStyle}>
            <p>{formattedDate}</p>
            <p>{formattedTime}</p>
          </div>
          <div className="icon-bar">
            <br />
            {user && <NavLink>{user.name}</NavLink>}
            <br />
            <NavLink
              to="/dashboard"
              activeclassname="active"
              id="dashboard"
              style={linkStyle}
              onClick={tryToAccess}
            >
              <i className="glyphicon glyphicon-home"></i> Dashboard
            </NavLink>
            <NavLink
              to="/products"
              activeclassname="active"
              id="products"
              style={linkStyle}
              onClick={tryToAccess}
            >
              <i className="material-icons">assessment</i> Inventory
            </NavLink>
            <NavLink
              to="/sales"
              activeclassname="active"
              id="sales"
              style={linkStyle}
            >
              <i className="material-icons">shopping_cart</i> Sales
            </NavLink>
            <NavLink
              to="/expenses"
              activeclassname="active"
              id="expenses"
              style={linkStyle}
              onClick={tryToAccess}
            >
              <i className="material-icons">style</i> Expenses
            </NavLink>
            <NavLink
              to="/staff"
              activeclassname="active"
              id="staff"
              style={linkStyle}
              onClick={tryToAccess}
            >
              <i className="material-icons">group</i> Salespersons
            </NavLink>
            <NavLink
              to="/reports"
              activeclassname="active"
              id="reports"
              style={linkStyle}
              onClick={tryToAccess}
            >
              <i className="material-icons">poll</i> Reports
            </NavLink>

            {user ? (
              <NavLink
                to="/"
                activeclassname="active"
                id="logout"
                style={linkStyle}
                onClick={handleLogout}
              >
                <i className="material-icons">power_settings_new</i> Log out
              </NavLink>
            ) : (
              <NavLink
                to="/"
                activeclassname="active"
                id="logout"
                style={linkStyle}
              >
                <i className="material-icons">power_settings_new</i> Log In
              </NavLink>
            )}
          </div>
        </nav>
      ) : null}
    </Fragment>
  );
}
