import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  return (
    <footer className="md:fixed md:bottom-0 w-full bg-white border-t py-4">
      <div className="mx-4 md:mx-6 flex justify-between items-center px-4 py-3 bg-white">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <img
              src="https://i.ibb.co.com/XBz524M/Screenshot-25.png"
              alt="Logo"
              className="h-16 md:h-[52px]"
            />
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex items-center gap-3 mx-auto">
          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-1 text-sm md:text-base font-bold hover:text-green-500"
            >
              <span>მთავარი1</span>
              <ChevronDown size={16} className="text-gray-700" />
            </button>

            {/* Dropdown Content */}
            {isDropdownOpen && (
              <div
                className="absolute bg-white border
               border-gray-300  -top-24 shadow-lg
                md:absolute 
                             -left-2  mb-28 mr-4  
                rounded-md w-52 z-20"
              >
                <Link
                  to="/road-signs"
                  className="block px-4 py-3 text-sm hover:bg-gray-100 border-b border-gray-200"
                >
                  ჩვენს შესახებ
                </Link>
                <Link
                  to="/categories"
                  className="block px-4 py-3 text-sm hover:bg-gray-100"
                >
                  კონტაქტი
                </Link>
              </div>
            )}
          </div>

          {/* Other Links */}
          <Link
            to="/tickets"
            className="text-sm md:text-base font-bold text-gray-700 hover:text-green-500"
          >
            ბილეთები
          </Link>
          <Link
            to="/test"
            className="text-sm md:text-base font-bold text-gray-700 hover:text-green-500"
          >
            გამოცდა
          </Link>
        </nav>
      </div>

      <div className="text-sm">
        <p className="flex justify-center gap-3 text-center text-gray-600">
          <span className="text-[12px] md:text-sm font-bold">
            ყველა უფლება დაცულია
          </span>
          <span className="text-[12px] md:text-sm"> @2025 | ZGLMedia</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
