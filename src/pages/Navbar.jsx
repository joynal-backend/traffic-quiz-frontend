import React from "react";
import { Mail, Phone, ChevronDown, Globe, Square, Snail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="border-b border-gray-200 shadow-md">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-4 py-2 text-sm bg-gray-50">
        <div className="flex items-center space-x-4">
          <span className="text-green-500">●</span>
          <span>Driving School "Start"</span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Phone size={16} className="text-green-500" />
            <span>+995 568992731</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail size={16} className="text-blue-500" />
            <span>alekomamadashvili@gmail.com</span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <div className="flex justify-between items-center px-4 py-3 bg-white">
        <div className="flex items-center space-x-12 ">
          {/* Logo */}
          <div className="flex items-center space-x-2">
          <Snail />
            <span className="font-bold text-lg">TRAFFIC</span> 
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-6">
            <ul className="font-medium flex space-x-4">
              <li className="flex place-items-center space-x-1 group">
                <Square
                  size={13}
                  className="text-green-500 mb-1 transition-colors duration-200 group-hover:bg-[#58D389]"
                />
                <Link
                  to="/"
                  className="text-gray-700 transition-colors duration-200 group-hover:text-green-500"
                >
                  Home
                </Link>
              </li>
              <li className="flex place-items-center space-x-1 group">
                <Square
                  size={13}
                  className="text-green-500 mb-1 transition-colors duration-200 group-hover:bg-[#58D389]"
                />
                <Link
                  to="/quiz"
                  className="text-gray-700 transition-colors duration-200 group-hover:text-green-500"
                >
                  Exam
                </Link>
              </li>
              <li className="flex place-items-center space-x-1 group">
                <Square
                  size={13}
                  className="text-green-500 mb-1 transition-colors duration-200 group-hover:bg-[#58D389]"
                />
                <Link
                  to="/tickets"
                  className="text-gray-700 transition-colors duration-200 group-hover:text-green-500"
                >
                  Tickets
                </Link>
              </li>
              <li className="flex place-items-center space-x-1 group">
                <Square
                  size={13}
                  className="text-green-500 mb-1 transition-colors duration-200 group-hover:bg-[#58D389]"
                />
                <Link
                  to="/information"
                  className="text-gray-700 transition-colors duration-200 group-hover:text-green-500"
                >
                  Information
                </Link>
              </li>
              <li className="flex place-items-center space-x-1 group">
                <Square
                  size={13}
                  className="text-green-500 mb-1 transition-colors duration-200 group-hover:bg-[#58D389]"
                />
                <Link
                  to="/contact"
                  className="text-gray-700 transition-colors duration-200 group-hover:text-green-500"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Language Selector */}
        <div className="flex items-center space-x-2">
          <Globe size={20} className="text-gray-500" />
          <Button
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-md"
            variant="outline"
          >
            <span>Georgian</span>
            <ChevronDown size={16} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
