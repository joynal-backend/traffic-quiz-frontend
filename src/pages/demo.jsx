import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Users, HelpCircle, LogOut, Menu, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { use } from "react";

import { Button } from "@/components/ui/button";
import AdminTopics from "./AdminTopics";
import CreateQuestion from "./CreateQuestion";
const AdminQuestions = () => {
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
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchQuestions();
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

  // Topics

  // Questions

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://traffic-master-backend-bay.vercel.app/questions/all-questions"
      );
      setQuestions(response.data);
      setFilteredQuestions(response.data);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await axios.delete(
        `https://traffic-master-backend-bay.vercel.app/questions/delete-question/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchQuestions();
    } catch (error) {
      console.error("Failed to delete question", error);
    }
  };




  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = questions.filter((question) =>
      question.question.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredQuestions(filtered);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const filterQuestionsByTopic = (topic) => {
    setSelectedTopic(topic);
    if (topic === "all") {
      setFilteredQuestions(questions);
    } else {
      const filtered = questions.filter(
        (question) => question.topics === topic
      );
      setFilteredQuestions(filtered);
    }
  };

  const uniqueTopics = [
    ...new Set(questions.map((question) => question.topics)),
  ];

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredQuestions.length / questionsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  return (
    <div>
      {" "}
      <>
        <div className="flex space-x-4 mb-5">
          <button
            onClick={() => setQuestionTabActive("all")}
            className={`p-2 ${
              questionTabActive === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            All Questions
          </button>
          <button
            onClick={() => setQuestionTabActive("create")}
            className={`p-2 ${
              questionTabActive === "create"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Create Question
          </button>
          <button
            onClick={() => setQuestionTabActive("topics")}
            className={`p-2 ${
              questionTabActive === "topics"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Topics Management
          </button>
        </div>

        {questionTabActive === "all" && (
        
        )}

        {questionTabActive === "create" && (
          <div>
            <CreateQuestion />
          </div>
        )}

        {questionTabActive === "topics" && <AdminTopics />}
      </>
    </div>
  );
};

export default AdminQuestions;