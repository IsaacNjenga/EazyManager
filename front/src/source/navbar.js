import React, { useState, useEffect, useContext, Fragment } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../App";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function Navbar() {
  const { user, setUser, isAuthenticated, loggedIn, setIsAuthenticated } =
    useContext(UserContext);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

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
      await axios.get("/logout", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setIsAuthenticated(false);
      toast.success("Logged out");
      localStorage.clear();
      window.location.reload();
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const tryToAccess = () => {
    if (user && user.role !== "admin") {
      toast.error("You are not authorised");
    }
  };

  return (
    <Fragment>
      {loggedIn ? (
        <nav style={{ display: "flex" }}>
          <div id="timenav" className="time" style={dateTimeStyle}>
            <p>{formattedDate}</p>
            <p>{formattedTime}</p>
          </div>
          <div className="icon-bar">
            <br />
            {user && (
              <NavLink to="/" className="username-btn">
                {user.name}
              </NavLink>
            )}
            <br />
            <NavLink
              to="/dashboard"
              activeClassName="active"
              id="dashboard"
              style={linkStyle}
              onClick={tryToAccess}
            >
              <i className="glyphicon glyphicon-home"></i> Dashboard
            </NavLink>
            <NavLink
              to="/products"
              activeClassName="active"
              id="products"
              style={linkStyle}
              onClick={tryToAccess}
            >
              <i className="material-icons">assessment</i> Inventory
            </NavLink>
            <NavLink
              to="/sales"
              activeClassName="active"
              id="sales"
              style={linkStyle}
            >
              <i className="material-icons">shopping_cart</i> Sales
            </NavLink>{" "}
            <NavLink
              to="/customers"
              activeClassName="active"
              id="expenses"
              style={linkStyle}
              onClick={tryToAccess}
            >
              <i className="material-icons">person</i> Customers
            </NavLink>
            <NavLink
              to="/expenses"
              activeClassName="active"
              id="expenses"
              style={linkStyle}
              onClick={tryToAccess}
            >
              <i className="material-icons">style</i> Expenses
            </NavLink>
            <NavLink
              to="/staff"
              activeClassName="active"
              id="staff"
              style={linkStyle}
              onClick={tryToAccess}
            >
              <i className="material-icons">group</i> Salespersons
            </NavLink>
            <NavLink
              to="/reports"
              activeClassName="active"
              id="reports"
              style={linkStyle}
              onClick={tryToAccess}
            >
              <i className="material-icons">poll</i> Reports
            </NavLink>
            <NavLink
              to="/logs"
              activeClassName="active"
              id="logs"
              style={linkStyle}
              onClick={tryToAccess}
            >
              <i className="material-icons">receipt</i> Logs
            </NavLink>
            <NavLink
              to="/add-user"
              activeClassName="active"
              id="user"
              style={linkStyle}
              onClick={tryToAccess}
            >
              <i className="material-icons">groupadd</i> Add User
            </NavLink>
            {user ? (
              <NavLink
                to="/"
                activeClassName="active"
                id="logout"
                style={linkStyle}
                onClick={handleLogout}
              >
                <i className="material-icons">power_settings_new</i> Log out
              </NavLink>
            ) : (
              <NavLink
                to="/"
                activeClassName="active"
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
