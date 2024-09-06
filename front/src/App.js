import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import Dashboard from "./dashboard";
import Products from "./products";
import Sales from "./sales";
import Expenses from "./expenses";
import Staff from "./staff";
import Reports from "./reports";
import Login from "./Login";
import Register from "./Register";
import UpdateStaff from "./pages/updateStaff";
import AddStaff from "./pages/addStaff";
import SplashScreen from "./splashScreen";
import AddProducts from "./pages/addProducts";
import UpdateProducts from "./pages/updateProducts";
import UpdateExpense from "./pages/updateExpense";
import AddExpense from "./pages/addExpense";
import UpdateSale from "./pages/updateSale";
import AddSale from "./pages/addSale";
import ProtectedRoute from "./context/protectedRoutes";
import Logs from "./logs";

export const UserContext = createContext();

axios.defaults.baseURL = `https://eazy-manager.vercel.app/EasyManager/`;
axios.defaults.withCredentials = true;

//https://eazy-manager.vercel.app/

const router = createBrowserRouter([
  { path: "*", element: <SplashScreen /> },
  { path: "/login", element: <Login /> },
  /*{
    path: "/register",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Register />{" "}
      </ProtectedRoute>
    ),
  },*/
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/products/*",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Products />
      </ProtectedRoute>
    ),
  },
  {
    path: "/sales/*",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Sales />
      </ProtectedRoute>
    ),
  },
  {
    path: "/expenses/*",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Expenses />
      </ProtectedRoute>
    ),
  },
  {
    path: "/staff/*",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Staff />
      </ProtectedRoute>
    ),
  },
  {
    path: "/reports",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Reports />
      </ProtectedRoute>
    ),
  },
  {
    path: "/update-staff/:id",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <UpdateStaff />
      </ProtectedRoute>
    ),
  },
  {
    path: "/add-staff",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AddStaff />
      </ProtectedRoute>
    ),
  },
  {
    path: "/update-expense/:id",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <UpdateExpense />
      </ProtectedRoute>
    ),
  },
  {
    path: "/add-expense",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AddExpense />
      </ProtectedRoute>
    ),
  },
  {
    path: "/update-sale/:id",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <UpdateSale />
      </ProtectedRoute>
    ),
  },
  {
    path: "/add-sale",
    element: (
      <ProtectedRoute allowedRoles={["admin", "salesperson"]}>
        <AddSale />
      </ProtectedRoute>
    ),
  },
  {
    path: "/update-product/:id",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <UpdateProducts />
      </ProtectedRoute>
    ),
  },
  {
    path: "/add-product",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AddProducts />
      </ProtectedRoute>
    ),
  },
  {
    path: "/logs",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Logs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/add-user",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Register />
      </ProtectedRoute>
    ),
  },
]);
function App() {
  const [user, setUser] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Fetch user data and set it to the state
    const fetchUser = async () => {
      try {
        const response = await axios.get("/verify", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    console.log("UserContext value in Navbar:", {
      loggedIn,
    });
  }, [loggedIn]);

  return (
    <>
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
        <RouterProvider router={router} />
        <Toaster position="top-right" toastOptions={{ duration: 2200 }} />
      </UserContext.Provider>
    </>
  );
}

export default App;
