import { useState } from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { About, Dashboard, Home, Projects, SignIn, SignUp } from "./Pages";
import { Header } from "./Components";
import toast, { Toaster } from "react-hot-toast";
import { UserProvider } from "./context/userContext";
import { GoogleOAuthProvider } from '@react-oauth/google';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
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
    element: <Dashboard />,
  },
  {
    path: "/projects",
    element: <Projects />,
  },
]);
console.log(import.meta.env.VITE_CLIENT_ID,"id")

const App = () => (
  <div className="px-8">
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
    <UserProvider>
      <Header />
      <RouterProvider router={router} />
    </UserProvider>
    <Toaster />
    </GoogleOAuthProvider>
  </div>
);

export default App;
