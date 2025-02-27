import App from "@/App";
import Exam from "@/pages/Exam";
import Result from "@/pages/Result";
import Home from "@/pages/Home";
import { createBrowserRouter } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import PrivateRoute from "./PrivetRoute";


const routes = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/exam",
    element: <Exam/>,
  },
  {
    path: "/result",
    element: <Result/>,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/login",
    element: <Login/>,
  },
]);

export { routes };