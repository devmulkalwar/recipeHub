import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t border-gray-200 p-6  hidden md:block">
      <div className="flex flex-col items-center">
        {/* Company Info */}
        <Typography variant="small" className="text-center text-gray-700 mb-4">
          &copy; {currentYear} RecipeHub. All Rights Reserved.
        </Typography>
        
        {/* Quick Links */}
        <div className="flex gap-6 mb-4">
          <Link to="/about" className="text-gray-600 hover:text-blue-500 transition-colors">About Us</Link>
          <Link to="/license" className="text-gray-600 hover:text-blue-500 transition-colors">License</Link>
          <Link to="/contribute" className="text-gray-600 hover:text-blue-500 transition-colors">Contribute</Link>
          <Link to="/contact" className="text-gray-600 hover:text-blue-500 transition-colors">Contact Us</Link>
        </div>

        {/* Social Media Icons */}
        <div className="flex gap-4">
          <a href="#" aria-label="Facebook" className="text-gray-600 hover:text-blue-600 transition-colors">
            <FaFacebook className="h-6 w-6" />
          </a>
          <a href="#" aria-label="Twitter" className="text-gray-600 hover:text-blue-600 transition-colors">
            <FaTwitter className="h-6 w-6" />
          </a>
          <a href="#" aria-label="LinkedIn" className="text-gray-600 hover:text-blue-600 transition-colors">
            <FaLinkedin className="h-6 w-6" />
          </a>
          <a href="#" aria-label="Instagram" className="text-gray-600 hover:text-blue-600 transition-colors">
            <FaInstagram className="h-6 w-6" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
