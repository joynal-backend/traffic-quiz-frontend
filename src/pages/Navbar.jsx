import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Car, ChevronDown, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown Menu
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkDeviceSize = () => {
      setIsSmallDevice(window.innerWidth < 768);
    };
    checkDeviceSize();
    window.addEventListener("resize", checkDeviceSize);
    return () => window.removeEventListener("resize", checkDeviceSize);
  }, []);

  const handleMouseEnter = () => !isSmallDevice && setIsDropdownOpen(true);
  const handleMouseLeave = () => !isSmallDevice && setIsDropdownOpen(false);
  const handleDropdownClick = () =>
    isSmallDevice && setIsDropdownOpen(!isDropdownOpen);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="max-h-24 lg:max-h-[84px] border-b border-gray-200 shadow-md mt-1">
      <header className="mx-4 md:mx-6">
        <div>
          <ul className="hidden md:flex items-center justify-between gap-6 mx-6 text-sm font-semibold">
            <li className="text-[13px] lg:text-sm">ავტოსკოლა ვარკეთილში</li>
            <li className="flex items-center">
              <Phone
                className="bg-[#BE3144] text-white rounded-lg p-[2px]"
                size={18}
              />
              <span className="ml-2 text-nowrap">+995 574-747-581</span>
            </li>
            <li className="flex items-center">
              <Mail
                className="bg-[#BE3144] text-white rounded-lg p-[2px]"
                size={18}
              />
              <span className="ml-2">guramdiasamidze123@gmail.com</span>
            </li>
            <li className="flex items-center gap-2 ">
              <MapPin size={16} className="text-red-500 " />
              <span className="text-nowrap"> ვარკეთილი, ჯავახეთის N 102</span>
            </li>
          </ul>
        </div>

        <hr className="my-1" />

        <div className="flex justify-between items-center px-4">
          
<Link to="/">
<img
            src="https://i.ibb.co.com/XBz524M/Screenshot-25.png"
            alt="Logo"
            className="h-12 md:h-[52px]"
          />
</Link>
          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {!isMenuOpen ? (
                <Menu size={24} className="text-gray-700" />
              ) : (
                <X size={24} className="text-gray-700" />
              )}
            </button>
          </div>

          <nav
            className={`${isMenuOpen ? "block" : "hidden"} 
            md:flex md:space-x-6 mx-auto flex flex-col 
            md:flex-row items-center gap-2 absolute md:static
             bg-white w-full md:w-auto left-0 top-[84px] 
             shadow-md md:shadow-none z-10`}
          >
            <div
              className="relative group"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="flex items-center gap-2 font-bold hover:text-green-500"
                onClick={handleDropdownClick}
              >
                <Car
                  size={20}
                  className="mb-1 text-gray-700 group-hover:text-green-500"
                />
                <span>მთავარი1</span>
                <ChevronDown
                  size={16}
                  className="text-gray-700 group-hover:text-green-500"
                />
              </button>

              <div
                className={`${isDropdownOpen ? "block" : "hidden"}
                 md:absolute bg-white border border-gray-300
                  
                  ${isSmallDevice ? "left-0" : "shadow-lg mt-0 rounded-md w-52"}
                  `}
              >
                <Link
                  to="/road-signs"
                  className="block px-4 py-3 text-sm hover:bg-gray-100 border-b border-gray-200"
                >
                  <span className="w-2 h-full bg-green-500 mr-2"></span>
                  ჩვენს შესახებ
                </Link>
                <Link
                  to="/categories"
                  className="block px-4 py-3 text-sm hover:bg-gray-100 border-b border-gray-200"
                >
           კონტაქტი
                </Link>
                
              </div>
            </div>

            <Link
              to="/tickets"
              className="flex items-center gap-2 mr-4 text-sm font-bold text-gray-700 hover:text-green-500"
            >
              <Car
                size={20}
                className="mb-1 text-gray-700 group-hover:text-green-500"
              />
 ბილეთები
            </Link>

            <Link
              to="/test"
              className="flex items-center gap-2 text-sm font-bold mr-7 text-gray-700 hover:text-green-500"
            >
              <Car
                size={20}
                className="mb-1 text-gray-700 group-hover:text-green-500"
              />
     გამოცდა
            </Link>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
