import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Result from "../pages/Result";
import Quiz from "@/pages/Quiz";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },    
    {
        path: "/result",
        element: <Result />,
    },
    ,
    {
        path: "/exam",
        element: <Quiz />,
    },
]);