import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Users, HelpCircle, LogOut, Menu, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { use } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Admin from "./Admin/Admin";
import AdminQuestions from "./Admin/AdminQuestions";

function Dashboard() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState(0);
  const [forgotPasswordUsername, setForgotPasswordUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [topicField, setTopicField] = useState("");
  const [questionTabActive, setQuestionTabActive] = useState("all");
  const [oldPassword, setOldPassword] = useState("");
  const [editAdmin, setEditAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
    }
  }, [token, navigate]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarOpen &&
        !event.target.closest(".sidebar") &&
        !event.target.closest(".menu-button")
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <ToastContainer
        className="toast-position"
        position="top-center"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {/* Mobile Header with Menu */}
      <div className="md:hidden bg-blue-900 text-white p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <button
          onClick={toggleSidebar}
          className="focus:outline-none menu-button"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar - responsive height and toggle management */}
      <div
        className={`sidebar ${
          sidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-72 h-64 md:h-full bg-[#2C3930] text-white p-5 flex flex-col ${
          sidebarOpen ? "absolute z-10 top-16 bottom-0" : ""
        } md:relative md:top-0`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center hidden md:block">
          Dashboard
        </h2>
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            onClick={() => {
              setActiveTab("admin");
              if (window.innerWidth < 768) setSidebarOpen(false);
            }}
            className={`w-full flex items-center p-3 my-2 rounded transition-all ${
              activeTab === "admin" ? "bg-blue-700" : "hover:bg-blue-800"
            }`}
          >
            <Users className="mr-3" /> Admins
          </button>
          <button
            onClick={() => {
              setActiveTab("question");
              if (window.innerWidth < 768) setSidebarOpen(false);
            }}
            className={`w-full flex items-center p-3 my-2 rounded transition-all ${
              activeTab === "question" ? "bg-blue-700" : "hover:bg-blue-800"
            }`}
          >
            <HelpCircle className="mr-3" /> Questions
          </button>
          <button
            onClick={handleLogout}
            className="w-full mt-auto flex items-center p-3 bg-red-600 hover:bg-red-700 rounded transition-all"
          >
            <LogOut className="mr-3" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 overflow-auto bg-[#F8E7F6]">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            {activeTab === "admin" && (
             
              <>
                <Admin />
              </>
            )}
            {activeTab === "question" && (
            
              <>
                <div className="flex space-x-4 mb-5">
                  <button
                    onClick={() => setQuestionTabActive("all")}
                    className={`p-2 rounded-sm ${
                      questionTabActive === "all"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    All Questions
                  </button>
                  <button
                    onClick={() => setQuestionTabActive("create")}
                    className={`p-2 rounded-sm ${
                      questionTabActive === "create"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    Create Question
                  </button>
                  <button
                    onClick={() => setQuestionTabActive("topics")}
                    className={`p-2 rounded-sm ${
                      questionTabActive === "topics"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    Vehicle & Topics
                  </button>
                </div>

                <AdminQuestions
                  questionTabActive={questionTabActive}
                  setQuestionTabActive={setQuestionTabActive}
                  loading={loading}
                  setLoading={setLoading}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
