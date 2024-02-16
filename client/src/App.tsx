import { useState } from "react";

import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { About, Home, Projects, SignIn, SignUp } from "./Pages";
import { Header } from "./Components";
import toast, { Toaster } from "react-hot-toast";
import { UserProvider } from "./context/userContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import PrivateRoute from "./Components/PrivateRoute";
import DashProfile from "./Components/DashProfile";
import CreateBlog from "./Components/CreateBlog";
import Blog from "./Pages/Blog";
import NotFound from "./Pages/NotFound";
import { BlogContextProvider } from "./context/blogContext";
import { Search } from "./Pages/Search";

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path:"*",
        element:<NotFound/>
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: (
          <PrivateRoute>
            <About />
          </PrivateRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <DashProfile />
          </PrivateRoute>
        ),
      },
      {
        path:"/search",
        element: <Search/>
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
        path: "/projects",
        element: <Projects />,
      },
      {
        path: "/blog",

        children: [
          {
            path:"/blog/:blogSlug",
            element:<Blog/>
          },
          {
            path: "/blog/create",
            element: (
              <PrivateRoute>
                <CreateBlog />
              </PrivateRoute>
            ),
          },
          {
            path: "/blog/edit/:blogSlug",
            element: (
              <PrivateRoute>
                <CreateBlog />
              </PrivateRoute>
            ),
          },
        ],
      },
      {
        path: "/creator/:username",
        element: <Home />,
      },
    ],
  },
]);

const App = () => (
  <div className=" px-2 md:px-8">
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <UserProvider>
        <BlogContextProvider>
           <RouterProvider router={router} />
        </BlogContextProvider>
      </UserProvider>
      <Toaster />
    </GoogleOAuthProvider>
  </div>
);

export default App;
