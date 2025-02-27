import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";

const CreateQuestion = ({ onQuestionCreated, onTopicCreated }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Loading state for the button
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [questionTitle, setQuestionTitle] = useState("");
  const [options, setOptions] = useState(["", ""]); // Initialize with two empty options
  const [correctOption, setCorrectOption] = useState(""); // Store the correct option value
  const [selectedVehicles, setSelectedVehicles] = useState([]); // Array for multiple vehicles
  const [selectedTopic, setSelectedTopic] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]); // All available vehicles

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch all topics and vehicles
  useEffect(() => {
    const fetchTopicsAndVehicles = async () => {
      try {
        const topicsResponse = await axios.get("https://traffic-master-backend-bay.vercel.app/topics/all-topics");
        setTopics(topicsResponse.data);

        // Extract unique vehicles from topics
        const vehicles = [...new Set(topicsResponse.data.flatMap((topic) => topic.vehicleType))];
        setAllVehicles(vehicles);
      } catch (error) {
        console.error("Failed to fetch topics or vehicles", error);
      }
    };
    fetchTopicsAndVehicles();
  }, []);

  // Filter topics based on selected vehicles
  useEffect(() => {
    if (selectedVehicles.length > 0) {
      const filtered = topics.filter((topic) =>
        selectedVehicles.some((vehicle) => topic.vehicleType.includes(vehicle))
      );
      setFilteredTopics(filtered);
    } else {
      setFilteredTopics([]);
    }
  }, [selectedVehicles, topics]);

  // Handle vehicle selection
  const handleVehicleChange = (vehicle) => {
    setSelectedVehicles((prev) =>
      prev.includes(vehicle)
        ? prev.filter((v) => v !== vehicle) // Deselect vehicle
        : [...prev, vehicle] // Select vehicle
    );
  };

  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions([...options, ""]); // Add a new empty option
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedVehicles.length === 0) {
      toast.error("Please select at least one vehicle type.");
      return;
    }
    if (!selectedTopic) {
      toast.error("Please select a topic.");
      return;
    }
    if (options.some((opt) => opt.trim() === "")) {
      toast.error("All options must be filled.");
      return;
    }
    if (!correctOption) {
      toast.error("Please select the correct option.");
      return;
    }

    setLoading(true); // Start loading

    const formData = new FormData();
    formData.append("vehicleType", selectedVehicles.join(",")); // Append all selected vehicles
    formData.append("topic", selectedTopic);
    formData.append("question", questionTitle);
    options.forEach((option, index) => formData.append(`option${index + 1}`, option));
    formData.append("correctOption", correctOption); // Append the correct option value
    console.log("Correct Option:", correctOption);
    if (image) {
      formData.append("image", image);
    }

    try {
      await handleCreateQuestion(formData);
      toast.success("Question added successfully!");
      onQuestionCreated();
      onTopicCreated();
      setQuestionTitle("");
      setOptions(["", ""]); // Reset to two empty options
      setCorrectOption(""); // Reset correct option
      setImage(null);
      setImagePreview(null);
      setSelectedVehicles([]);
      setSelectedTopic("");
    } catch (error) {
      console.error("Error submitting question:", error);
      toast.error("Failed to add question.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Handle question creation
  const handleCreateQuestion = async (formData) => {
    let imageUrl = "";

    if (image) {
      const imageData = new FormData();
      imageData.append("file", image);
      imageData.append("upload_preset", "traffic-exam");

      try {
        const cloudinaryResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/deyqhzw8p/image/upload",
          imageData
        );
        imageUrl = cloudinaryResponse.data.secure_url;
      } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
      }
    }

    formData.append("imageUrl", imageUrl);

    await axios.post(
      "https://traffic-master-backend-bay.vercel.app/questions/add-question",
      Object.fromEntries(formData),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  return (
    <div>
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
      <form
        onSubmit={handleSubmit}
        className="mb-5 w-full bg-gradient-to-br from-blue-50 to-purple-50 p-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create New Question
        </h2>

        {/* Select Vehicles (Checkboxes) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Choose Vehicle Type(s)
          </label>
          <div className="flex flex-wrap gap-3">
            {allVehicles.map((vehicle, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`vehicle-${index}`}
                  value={vehicle}
                  checked={selectedVehicles.includes(vehicle)}
                  onChange={() => handleVehicleChange(vehicle)}
                  className="w-4 h-4"
                />
                <label htmlFor={`vehicle-${index}`} className="text-sm">
                  {vehicle}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Select Topic (Filtered based on Selected Vehicles) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Choose Topic
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="">Select Topic</option>
            {filteredTopics.map((topic) => (
              <option key={topic._id} value={topic.topic}>
                {topic.topic}
              </option>
            ))}
          </select>
        </div>

        {/* Question Text */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Title
          </label>
          <input
            type="text"
            placeholder="Enter Question Text"
            value={questionTitle}
            onChange={(e) => setQuestionTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Options */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              {index >= 2 && ( // Show remove button for options beyond the first two
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
          {options.length < 4 && ( // Show "Add More Option" button if less than 4 options
            <button
              type="button"
              onClick={handleAddOption}
              className="flex items-center gap-2 mt-2 text-blue-600"
            >
              <PlusCircle size={18} /> Add More Option
            </button>
          )}
        </div>

        {/* Correct Option Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correct Option
          </label>
          <select
            value={correctOption}
            onChange={(e) => setCorrectOption(e.target.value)} // Store the correct option value
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="">Select Correct Option</option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                Option {index + 1}: {option}
              </option>
            ))}
          </select>
        </div>

        {/* Upload Image */}
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="w-48 h-24 object-cover rounded-lg mb-4" />
        )}

        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg flex items-center justify-center"
          disabled={loading} // Disable button when loading
        >
          {loading ? (
            <Loader2 className="animate-spin mr-2" /> // Show spinner when loading
          ) : null}
          {loading ? "Adding..." : "Add Question"}
        </button>
      </form>
    </div>
  );
};

export default CreateQuestion;