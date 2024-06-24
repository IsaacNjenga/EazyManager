import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import Navbar from "./source/navbar";
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
import { UserContextProvider } from "./context/userContext";
import ProtectedRoute from "./context/protectedRoutes";
import Logs from "./logs";

axios.defaults.baseURL = "http://localhost:3001/";
axios.defaults.withCredentials = true;
//https://eazy-manager.vercel.app/
function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Navbar />
        <Toaster position="top-right" toastOptions={{ duration: 2200 }} />
        <Routes>
          <Route path="*" element={<SplashScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Sales />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Expenses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Staff />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-staff/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UpdateStaff />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-staff"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AddStaff />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-expense/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UpdateExpense />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-expense"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AddExpense />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-sale/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UpdateSale />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-sale"
            element={
              <ProtectedRoute allowedRoles={["admin", "salesperson"]}>
                <AddSale />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-product/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UpdateProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AddProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logs"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Logs />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
