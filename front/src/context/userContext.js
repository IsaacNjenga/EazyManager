import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`profile`);
        setUser(data);
        setIsAuthenticated(true);
        setLoggedIn(true);
      } catch (error) {
        setIsAuthenticated(false);
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (loggedIn) {
      fetchData();
    } else {
      setLoading(false); // Ensure loading is set to false if already logged in
    }
  }, [loggedIn, user, isAuthenticated]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        loggedIn,
        setLoggedIn,
      }}
    >
      {loading ? (
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
      ) : (
        children
      )}
    </UserContext.Provider>
  );
}
