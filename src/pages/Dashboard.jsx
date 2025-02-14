import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Users, HelpCircle, LogOut, Menu, X } from "lucide-react";

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
  const API_URL = import.meta.env.VITE_API_URL;
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
  const [topic, setTopic] = useState("");
  const [questionTabActive, setQuestionTabActive] = useState("all");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchAdmins();
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

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(response.data);
    } catch (error) {
      console.error("Failed to fetch admins", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/questions/all-questions`);
      setQuestions(response.data);
      setFilteredQuestions(response.data);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    } finally {
      setLoading(false);
    }
  };
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/admin/create",
        { username, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAdmins();
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Failed to create admin", error);
    }
  };
  const handleDeleteAdmin = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAdmins();
    } catch (error) {
      console.error("Failed to delete admin", error);
    }
  };
  
  const handleDeleteQuestion = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/questions/delete-question/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchQuestions();
    } catch (error) {
      console.error("Failed to delete question", error);
    }
  };
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/admin/forgot-password", {
        username: forgotPasswordUsername,
        newPassword,
      });
      alert("Password reset successfully");
      setForgotPasswordUsername("");
      setNewPassword("");
    } catch (error) {
      console.error("Failed to reset password", error);
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleCreateQuestion = async (formData) => {
    console.log("handleCreateQuestion", formData);
  
    // Extract image file from FormData
    const imageFile = formData.get("image");
  
    let imageUrl = "";
    if (imageFile) {
      const imageData = new FormData();
      imageData.append("file", imageFile);
      imageData.append("upload_preset", "traffic-master"); // Replace with your Cloudinary Upload Preset
  
      try {
        const cloudinaryResponse = await axios.post(
      
          "https://api.cloudinary.com/v1_1/dn32g7ywr/image/upload",
          imageData
        );
        imageUrl = cloudinaryResponse.data.secure_url; // Get image URL
        console.log("Uploaded Image URL:", imageUrl);
      } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        return;
      }
    }
  
    // Append Cloudinary Image URL to FormData
    formData.append("imageUrl", imageUrl);
    console.log('formData', formData);
  
    //Now, send the complete form data to your backend
    try {
      const response = await axios.post(
        "http://localhost:5000/questions/add-question", // Replace with your backend API endpoint
        Object.fromEntries(formData), // Convert FormData to JSON
        { headers: { "Content-Type": "application/json" , "Authorization": `Bearer ${token}` } }
      );
  
      console.log("Question Created:", response.data);
      alert("Question added successfully!");
    } catch (error) {
      console.error("Error submitting question:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("topic", topic);
    formData.append("question", questionText);
    options.forEach((option, index) =>
      formData.append(`options[${index}]`, option)
    );
    
    formData.append("correctOption ", correctOption);
  
    if (image) {
      formData.append("image", image); // Add image file
    }
  
    handleCreateQuestion(formData);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = questions.filter((question) =>
      question.question.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredQuestions(filtered);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const filterQuestionsByTopic = (topic) => {
    setSelectedTopic(topic);
    if (topic === "all") {
      setFilteredQuestions(questions);
    } else {
      const filtered = questions.filter((question) => question.topics === topic);
      setFilteredQuestions(filtered);
    }
  };
  const uniqueTopics = [...new Set(questions.map((question) => question.topics))];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Mobile Header with Menu */}
      <div className="md:hidden bg-blue-900 text-white p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Dashboard</h1>
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
        } md:block w-full md:w-72 h-64 md:h-full bg-blue-900 text-white p-5 flex flex-col ${
          sidebarOpen ? "absolute z-10 top-16 bottom-0" : ""
        } md:relative md:top-0`}
      >
        <h1 className="text-2xl font-bold mb-6 text-center hidden md:block">
          Dashboard
        </h1>
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
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            {activeTab === "admin" && (
              <div>
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold mb-4">
                    All Admins
                  </h2>
                  <ul>
                    {admins.map((admin) => (
                      <li
                        key={admin._id}
                        className="flex items-center justify-between p-3 bg-white shadow-md rounded mb-2"
                      >
                        <span>{admin.username}</span>
                        <button
                          onClick={() => handleDeleteAdmin(admin._id)}
                          className="p-2 bg-red-500 text-white rounded"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Forget Password Form */}
                <form onSubmit={handleForgotPassword} className="mb-5">
                  <h2 className="text-xl font-semibold">Forgot Password</h2>
                  <input
                    type="text"
                    placeholder="Username"
                    value={forgotPasswordUsername}
                    onChange={(e) => setForgotPasswordUsername(e.target.value)}
                    className="p-2 border rounded w-full my-2"
                    required
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="p-2 border rounded w-full my-2"
                    required
                  />
                  <button
                    type="submit"
                    className="p-2 bg-blue-500 text-white rounded"
                  >
                    Send Reset Link
                  </button>
                </form>
              </div>
            )}
            {activeTab === "question" && (
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
                </div>

                {questionTabActive === "all" && (
                  <>
                   <div className="p-5">
                   

                    <div className="mb-5">
                      <h2 className="text-xl font-semibold">Filter by Topic</h2>
                      <select
                        className="p-2 border rounded mt-2"
                        value={selectedTopic}
                        onChange={(e) => filterQuestionsByTopic(e.target.value)}
                      >
                        <option value="all">All Topics</option>
                        {uniqueTopics?.map((topic, index) => (
                          <option key={index} value={topic}>
                            {topic}
                          </option>
                        ))}
                      </select>
                    </div>

                    <h2 className="text-xl font-semibold">All Questions</h2>
                    <h2 className="mb-2 text-lg font-semibold">
                      {filteredQuestions.length} questions found
                    </h2>
                    <div>
                      {filteredQuestions.length > 0 ? (
                        filteredQuestions.map((question) => (
                          <ul className="mb-4 p-4 border rounded flex justify-between list-none">
                            <li key={question._id}>
                              {question.image && (
                                <img
                                  src={question.image}
                                  alt="Question"
                                  className="w-64 h-24 object-cover mb-2"
                                />
                              )}
                              <h1 className="font-semibold">
                                {question.question}
                              </h1>
                              <ul className="mt-2">
                                {question.options?.map((option, index) => (
                                  <li key={index} className="">
                                    {option}{" "}
                                    {index === question.correctOption &&
                                      "(Correct Answer)"}
                                  </li>
                                ))}
                              </ul>
                            </li>
                            <li>
                              <button
                                onClick={() =>
                                  handleDeleteQuestion(question._id)
                                }
                                className="p-2 bg-red-500 text-white rounded"
                              >
                                Delete
                              </button>
                            </li>
                          </ul>
                        ))
                      ) : (
                        <p>No questions found.</p>
                      )}
                    </div>
                  </div>

           
                  </>
                )}

                {questionTabActive === "create" && (
              
                   <form onSubmit={handleSubmit} className="mb-5">
                   <h2 className="text-xl font-semibold">
                     Create New Question
                   </h2>

                   <input
                     type="text"
                     placeholder="Topic"
                     value={topic}
                     onChange={(e) => setTopic(e.target.value)}
                     className="p-2 border rounded w-full my-2"
                     required
                   />
                   <input
                     type="text"
                     placeholder="Question Text"
                     value={questionText}
                     onChange={(e) => setQuestionText(e.target.value)}
                     className="p-2 border rounded w-full my-2"
                     required
                   />

                   {options.map((option, index) => (
                     <input
                       key={index}
                       type="text"
                       placeholder={`Option ${index + 1}`}
                       value={option}
                       onChange={(e) => {
                         const newOptions = [...options];
                         newOptions[index] = e.target.value;
                         setOptions(newOptions);
                       }}
                       className="p-2 border rounded w-full my-2"
                       required
                     />
                   ))}

                   <select
                     value={correctOption}
                     onChange={(e) =>
                       setCorrectOption(parseInt(e.target.value))
                     }
                     className="p-2 border rounded w-full my-2"
                   >
                     {options.map((_, index) => (
                       <option key={index} value={index}>
                         Option {index + 1}
                       </option>
                     ))}
                   </select>

                   <input
                     type="file"
                     accept="image/*"
                     onChange={handleImageChange}
                     className="p-2 border rounded w-full my-2"
                   />

                   {imagePreview && (
                     <img
                       src={imagePreview}
                       alt="Preview"
                       className="w-full h-40 object-cover my-2 rounded border"
                     />
                   )}

                   <button
                     type="submit"
                     className="p-2 bg-green-500 text-white rounded"
                   >
                     Add Question
                   </button>
                 </form>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
