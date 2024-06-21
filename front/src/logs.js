import axios from "axios";
import React, { useState, useEffect } from "react";

function Logs() {
  const [logins, setLogins] = useState([]);
  const [logouts, setLogouts] = useState([]);

  useEffect(() => {
    axios
      .get(`/logins`)
      .then((result) => {
        const sortedLogins = result.data.sort((a, b) => {
          return a.loginTime.localeCompare(b.loginTime);
        });
        setLogins(sortedLogins);
      })
      .catch((err) => console.log(err));

    axios
      .get(`/logouts`)
      .then((result) => {
        const sortedLogouts = result.data.sort((a, b) => {
          return a.logoutTime.localeCompare(b.logoutTime);
        });
        setLogouts(sortedLogouts);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="logs-container">
      <h1 className="logs-title">Logs</h1>

      <div className="logs-tables-container">
        <div className="logs-table">
          <h2>Login Times</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>User Number</th>
                <th>Login Time</th>
              </tr>
            </thead>
            <tbody>
              {logins.map((login, index) => (
                <tr key={login._id}>
                  <td>{index + 1}</td>
                  <td>{login.number}</td>
                  <td>{login.loginTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="logs-table">
          <h2>Logout Times</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>User Number</th>
                <th>Logout Time</th>
              </tr>
            </thead>
            <tbody>
              {logouts.map((logout, index) => (
                <tr key={logout._id}>
                  <td>{index + 1}</td>
                  <td>{logout.number}</td>
                  <td>{logout.logoutTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Logs;
