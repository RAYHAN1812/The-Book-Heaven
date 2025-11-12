import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import MainLayout from "./layouts/MainLayout.jsx";
import AuthProvider from "./context/AuthProvider.jsx";

import Home from "./pages/Home.jsx";
import AllBooks from "./pages/AllBooks.jsx";
import BookDetails from "./pages/BookDetails.jsx";
import AddBook from "./pages/AddBook.jsx";
import UpdateBook from "./pages/UpdateBook.jsx";
import MyBooks from "./pages/MyBooks.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Custom404 from "./pages/Custom404.jsx";
import DeleteBook from "./pages/DeleteBook.jsx";

import PrivateRoute from "./components/PrivateRoute.jsx";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <MainLayout />,
      errorElement: <Custom404 />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/all-books", element: <AllBooks /> },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        {
          path: "/book/:id",
          element: (
            <PrivateRoute>
              <BookDetails />
            </PrivateRoute>
          ),
        },
        {
          path: "/add-book",
          element: (
            <PrivateRoute>
              <AddBook />
            </PrivateRoute>
          ),
        },
        {
          path: "/update-book/:id",
          element: (
            <PrivateRoute>
              <UpdateBook />
            </PrivateRoute>
          ),
        },
        {
          path: "/my-books",
          element: (
            <PrivateRoute>
              <MyBooks />
            </PrivateRoute>
          ),
        },
        {
          path: "/delete-book/:id",
          element: (
            <PrivateRoute>
              <DeleteBook />
            </PrivateRoute>
          ),
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  </React.StrictMode>
);
