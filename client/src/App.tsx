import { useState } from "react";

import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { About, Dashboard, Home, Projects, SignIn, SignUp } from "./Pages";
import { Header } from "./Components";
import toast, { Toaster } from "react-hot-toast";
import { UserProvider } from "./context/userContext";
import { GoogleOAuthProvider } from '@react-oauth/google';
import PrivateRoute from "./Components/PrivateRoute";
import DashProfile from "./Components/DashProfile";


const Layout = ()=>{
 return <>
  <Header/>
  <Outlet/>
  </>
}

const router = createBrowserRouter([
  {
    element:<Layout/>,
    children:[
      {
        path: "/",
        element: <PrivateRoute><Home /></PrivateRoute>,
      },
      {
        path: "/about",
        element:<PrivateRoute><About /></PrivateRoute> ,
      },
      {
        path: "/profile",
        element:<PrivateRoute><DashProfile /></PrivateRoute> ,
      },
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/dashboard",
        element: <PrivateRoute><Dashboard /></PrivateRoute>,
      },
      {
        path: "/projects",
        element: <Projects />,
      },
    ]
  }
]);

const App = () => (
  <div className="px-8">
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
    <Toaster />
    </GoogleOAuthProvider>
  </div>
);

export default App;
