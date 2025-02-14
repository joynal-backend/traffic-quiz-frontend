import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Result from "../pages/Result";
import Quiz from "@/pages/Quiz";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import PrivateRoute from "./PrivetRoute";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/result",
    element: <Result />,
  },
  {
    path: "/exam",
    element: <Quiz />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
]);
