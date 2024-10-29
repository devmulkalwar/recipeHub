import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";

// pages import
import { About, Chat, Contact, CreateRecipe, EditRecipe, Error, ForgotPassword, GetStarted, Home, Login, OTPPage, Profile, RecipeDetails, Recipes, ResetPassword, Signup } from "./pages/pages.js";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path:"get-started",
        element: <GetStarted />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "recipes", 
        element: <Recipes />,
      },
      {
        path: "chat", 
        element: <Chat />,
      },
      {
        path: "recipe/:id", 
        element: <RecipeDetails />,
      },
      {
        path: "create-recipe",
        element: <CreateRecipe />,
      },
      {
        path: "edit-recipe/:id", 
        element: <EditRecipe />,
      },
      {
        path: "verify-otp",
        element: <OTPPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password/:token",
        element: <ResetPassword />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(

    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
 
);
