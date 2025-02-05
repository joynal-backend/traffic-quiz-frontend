import { Snail } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t py-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        {/* Left Section: Logo & Contact Info */}
        <div className="flex flex-col items-center md:items-start space-y-2">
        <div className="flex items-center space-x-2">
          <Snail />
            <span className="font-bold text-lg">TRAFFIC</span> 
          </div>          <p className="text-sm text-gray-600">Mob: [+995] 568992731</p>
          <p className="text-sm text-gray-600">Email: alekomamadashvili@gmail.com</p>
        </div>

        {/* Middle Section: Navigation with Hover Effect */}
        <nav className="flex space-x-6 text-gray-700 mt-4 md:mt-0">
          {["Main", "Exam", "Tickets", "Signs", "Contact"].map((item, index) => (
            <div key={index} className="relative group">
              <Link
                to={`/${item.toLowerCase()}`}
                className={`hover:text-green-500 ${
                  item === "Exam" ? "text-black font-bold" : ""
                }`}
              >
                {item}
              </Link>
              <div
                className={`absolute left-0 right-0 h-[2px] transition-all duration-300 ${
                  item === "Exam"
                    ? "bg-green-500 w-full"
                    : "bg-green-500 w-0 group-hover:w-full"
                }`}
              />
            </div>
          ))}
        </nav>

        {/* Right Section: Copyright */}
        <div className="text-gray-700 text-sm mt-4 md:mt-0">© 2012 - 2025</div>
      </div>
    </footer>
  );
};

export default Footer;
