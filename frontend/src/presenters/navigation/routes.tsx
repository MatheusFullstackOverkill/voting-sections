import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../../App";
import { Login } from "./login";
import { SignUp } from "./sign-up";
import { Topics } from "./topics";
import { Topic } from "./topic";
import { CreateTopic } from "./create-topic";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/sign-up',
                element: <SignUp />
            },
            {
                path: '/topics',
                element: <Topics />
            },
            {
                path: '/topics/create',
                element: <CreateTopic />
            },
            {
                path: '/topics/:topic_id',
                element: <Topic />
            },
            {
                path: '',
                element: <Navigate to="/topics" />,
            }
        ]
    }
])