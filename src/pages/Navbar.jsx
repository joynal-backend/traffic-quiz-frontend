import React, { useState } from "react";
import { Mail, Phone, MapPin, Car, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  return (
    <header className="border-b border-gray-200 shadow-md mt-1">
      {/* Top Bar */}
      <div>
        <ul className="hidden md:flex flex-col items-center justify-between md:flex-row  lg:flex-row md:gap-6 lg:gap-6   mx-6 font-semibold">
          <li className=" ">ავტოსკოლა ვარკეთილში</li>
          <li className="flex items-center">
            <span>
              <Phone
                className=" bg-[#BE3144] text-white rounded-lg p-[2px] "
                size={18}
              />
            </span>
            <span className="ml-2">+995 574-747-581</span>
          </li>
          <li className="flex items-center">
            <span>
              <Mail
                className=" bg-[#BE3144] text-white rounded-lg p-[2px] "
                size={18}
              />
            </span>
            <span className="ml-2">guramdiasamidze123@gmail.com</span>
          </li>

          <li className="flex items-center gap-2">
            {" "}
            <MapPin
              size={16}
              color="#c33232"
              strokeWidth={3}
              className="text-red-500"
            />
            ვარკეთილი, ჯავახეთის N 102
          </li>
        </ul>
      </div>

      {/* Navbar */}
      <div className="flex justify-between items-center px-4 py-3 bg-white">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/src/assets/car-logo.png" alt="Logo" className="h-14" />
        </div>

        {/* Navigation Menu */}
        <nav className="md:flex space-x-1 md:space-x-6 mx-auto flex items-center">
          {/* Dropdown Menu */}
          <div
            className="relative group flex items-center space-x-1"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Car
              size={20}
              className="mb-1 transition-colors duration-200 group-hover:text-green-500 transform r text-gray-700"
            />

            <button className="flex items-center space-x-1  group-hover:text-green-500 font-bold">
              <span>მთავარი1</span>
              <ChevronDown
                size={16}
                className="text-gray-700 group-hover:text-green-500 font-bold"
              />
            </button>
            {/* Dropdown Content */}
            {isDropdownOpen && (
              <div className="absolute bg-white shadow-sm mt-28 font-bold rounded-md w-36">
                <Link to="/about" className="block px-4 py-2 hover:bg-gray-100">
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
            <Car
              size={20}
              className="mb-1 transition-colors duration-200 group-hover:text-green-500 transform r text-gray-700"
            />{" "}
            <span>ბილეთები</span>
          </Link>
          <Link
            to="/test"
            className=" group flex  items-center space-x-1 text-gray-700 hover:text-green-500 font-bold"
          >
            <Car
              size={20}
              className="mb-1 transition-colors duration-200 group-hover:text-green-500 transform r text-gray-700"
            />{" "}
            <span>გამოცდა</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
