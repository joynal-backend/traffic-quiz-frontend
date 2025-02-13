import { ChevronDown, Snail } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
    const handleMouseEnter = () => {
      setIsDropdownOpen(true);
    };
  
    const handleMouseLeave = () => {
      setIsDropdownOpen(false);
    };
  return (
    <footer className="w-full bg-white border-t py-4">
       <div className="flex justify-between items-center px-4 py-3 bg-white">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/src/assets/car-logo.png" alt="Logo" className="h-14" />
        </div>

        {/* Navigation Menu */}
        <nav className="md:flex space-x-6 mx-auto flex items-center">
          {/* Dropdown Menu */}
          <div
            className="relative group flex items-center space-x-1"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
                        

            <button className="flex items-center space-x-1  group-hover:text-green-500 font-bold">
              <span>მთავარი1</span>
              <ChevronDown size={16} className="text-gray-700 group-hover:text-green-500 font-bold" />
            </button>
            {/* Dropdown Content */}
            {isDropdownOpen && (
              <div className="absolute bg-white shadow-sm mt-28  rounded-md w-36">
                <Link
                  to="/"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  ჩვენს შესახებ
                </Link>
                <Link
                  to="/contact"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  კონტაქტი
                </Link>
              </div>
      )} 
          </div>

          {/* Other Links */}
          <Link
            to="/tickets"
            className="flex group items-center space-x-1 text-gray-700 hover:text-green-500 font-bold"
          >

<span>ბილეთები</span>
          </Link>
          <Link
            to="/test"
            className=" group flex  items-center space-x-1 text-gray-700 hover:text-green-500 font-bold"
          >

           <span>გამოცდა</span>
      
          </Link>
        </nav>
      </div>
      <div>
        <p className="flex justify-center gap-3 text-sm  text-center text-gray-600">
          <span className="font-bold">  ყველა უფლება დაცულია</span>
   <span>      (copyright logo) 2025 | ZGLMedia</span>

        </p>
      </div>
    </footer>
  );
};

export default Footer;
