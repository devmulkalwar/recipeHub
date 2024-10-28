// App.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Footer, Sidebar, Bottombar, Header } from "./components/components.js";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header for all devices */}
      <Header />

      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex flex-col flex-grow">
          <main className="flex-grow overflow-y-auto bg-gray-50">
            <Outlet />
          {/* Footer for each main content area */}
          <Footer className="flex-shrink-0" />
          </main>
        </div>
      </div>

      {/* Bottom Navigation for small devices */}
      <Bottombar />

      {/* Toast Notifications */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}

export default App;
