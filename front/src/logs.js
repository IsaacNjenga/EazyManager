import axios from "axios";
import React, { useState, useEffect } from "react";
import { parse, format } from "date-fns";
import Navbar from "./source/navbar";

function Logs() {
  const [logins, setLogins] = useState([]);
  const [logouts, setLogouts] = useState([]);

  useEffect(() => {
    axios
      .get(`/logins`)
      .then((result) => {
        const sortedLogins = result.data.sort((a, b) => {
          return new Date(b.loginTime) - new Date(a.loginTime);
        });
        setLogins(sortedLogins);
      })
      .catch((err) => console.log(err));

    axios
      .get(`/logouts`)
      .then((result) => {
        const sortedLogouts = result.data.sort((a, b) => {
          return new Date(b.logoutTime) - new Date(a.logoutTime);
        });
        setLogouts(sortedLogouts);
      })
      .catch((err) => console.log(err));
  }, []);

  const groupLogsByDate = (logs, timeKey) => {
    return logs.reduce((acc, log) => {
      const date = format(
        parse(log[timeKey], "dd-MM-yyyy, HH:mm:ss", new Date()),
        "yyyy-MM-dd"
      );
      acc[date] = acc[date] || [];
      acc[date].push(log);
      return acc;
    }, {});
  };

  const groupedLoginLogs = groupLogsByDate(logins, "loginTime");
  const groupedLogoutLogs = groupLogsByDate(logouts, "logoutTime");

  const sortedLoginDates = Object.keys(groupedLoginLogs).sort(
    (a, b) => new Date(b) - new Date(a)
  );
  const sortedLogoutDates = Object.keys(groupedLogoutLogs).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  return (
    <>
      <Navbar />
      <div id="main">
        <div className="logs-container">
          <h1 className="logs-title">Logs</h1>
          <div className="logs-tables-container">
            <div className="logs-table">
              <h2>
                <u>Login Sessions</u>
              </h2>
              {sortedLoginDates.map((date) => (
                <div key={date}>
                  <h3>{format(new Date(date), "EEEE, MMMM do, yyyy")}</h3>
                  <table>
                    <thead className="table-header">
                      <tr>
                        <th>#</th>
                        <th>User Number</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Login Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedLoginLogs[date].map((login, index) => (
                        <tr key={login._id}>
                          <td>{index + 1}</td>
                          <td>{login.number}</td>
                          <td>{login.name.toUpperCase()}</td>
                          <td>{login.role.toUpperCase()}</td>
                          <td>{login.loginTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            <div className="logs-table">
              <h2>
                <u>Logout Sessions</u>
              </h2>
              {sortedLogoutDates.map((date) => (
                <div key={date}>
                  <h3>{format(new Date(date), "EEEE, MMMM do, yyyy")}</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>User Number</th>
                        <th>Name</th>
                        <th>Logout Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedLogoutLogs[date].map((logout, index) => (
                        <tr key={logout._id}>
                          <td>{index + 1}</td>
                          <td>{logout.number}</td>
                          <td>{logout.name.toUpperCase()}</td>
                          <td>{logout.logoutTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Logs;
