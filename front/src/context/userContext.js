import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (!loggedIn) {
      const fetchData = async () => {
        try {
          const { data } = await axios.get(`profile`);
          setUser(data);
          setIsAuthenticated(true);
        } catch (error) {
          setIsAuthenticated(false);
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [loggedIn, user, isAuthenticated]); // Include user in dependencies to refetch user data if user state changes

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
        <div>Loading...</div> // Render loading indicator until user data is fetched
      ) : (
        children // Render children once user data is fetched
      )}
    </UserContext.Provider>
  );
}

