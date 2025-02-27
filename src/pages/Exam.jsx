import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { UsersRound } from "lucide-react";

const Exam = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [examCode, setExamCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [examQuestions, setExamQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]); // Store answers
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [autoMoveNext, setAutoMoveNext] = useState(false); // New state for auto move
  const [showFailModal, setShowFailModal] = useState(false); // State for fail modal

  const { selectedTopics, selectedVehicle } = location.state || {};

  useEffect(() => {
    // Check if the user came from the home page
    if (!location.state?.fromHome) {
      // Redirect to the home page if the state is missing
      navigate("/", { replace: true });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const fetchSelectedQuestions = async () => {
      const topicsQuery = selectedTopics.join(",");
      const vehicleQuery = selectedVehicle;

      console.log("Selected Topics:", topicsQuery);
      console.log("Selected Vehicle:", vehicleQuery);

      try {
        const apiUrl = `https://traffic-master-backend-bay.vercel.app/questions/all-questions?topics=${topicsQuery}&vehicleTypes=${vehicleQuery}`;
        const result = await axios.get(apiUrl);

        setExamQuestions(result.data.questions.slice(0, 30)); // Limit to the first 30 questions

        const randomCode = `#${Math.random()
          .toString(36)
          .slice(-4)
          .toUpperCase()}`;
        setExamCode(randomCode);

        // Reset the state
        setCurrentQuestionIndex(0);
        setUserAnswers(Array(result.data.questions.length).fill(null)); // Initialize answers array
        setTimeLeft(1800); // Reset timer to 30 minutes
        setCorrectAnswers(0);
        setWrongAnswers(0);
      } catch (error) {
        console.error("API Error:", error);
        setError("Failed to fetch questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedQuestions();
  }, [selectedTopics, selectedVehicle]); // Add selectedVehicle to dependency array

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1); // Decrease time by 1 second
      }, 1000); // Update every 1 second
      return () => clearInterval(timer);
    } else {
      // Handle time-up scenario
      setShowFailModal(true); // Show fail modal when time is up
    }
  }, [timeLeft]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Block keypresses if the fail modal is open
      if (showFailModal) return;

      const key = event.key;
      if (key >= "1" && key <= "4") {
        const optionIndex = parseInt(key, 10) - 1;
        const currentOptions = examQuestions[currentQuestionIndex]?.options;
        if (currentOptions && optionIndex < currentOptions.length) {
          handleAnswerClick(currentOptions[optionIndex]);
        }
      } else if (key === "Enter") {
        if (
          currentQuestionIndex < examQuestions.length - 1 &&
          userAnswers[currentQuestionIndex] !== null
        ) {
          setCurrentQuestionIndex((prev) => prev + 1);
        }
      } else if (key === "ArrowRight") {
        if (
          currentQuestionIndex < examQuestions.length - 1 &&
          userAnswers[currentQuestionIndex] !== null
        ) {
          setCurrentQuestionIndex((prev) => prev + 1);
        }
      } else if (key === "ArrowLeft") {
        setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentQuestionIndex, examQuestions, userAnswers, showFailModal]); // Add showFailModal to dependency array

  const handleAnswerClick = (option) => {
    if (userAnswers[currentQuestionIndex] !== null) return; // Prevent changing previous answers

    const correctAnswer = examQuestions[currentQuestionIndex].answer;
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = option;
    setUserAnswers(updatedAnswers);

    if (option === correctAnswer) {
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setWrongAnswers((prev) => prev + 1);
      if (wrongAnswers + 1 >= 4) {
        setShowFailModal(true); // Show fail modal if wrong answers reach 4
      }
    }

    // Automatically move to the next question after 0.5 seconds if autoMoveNext is true
    if (autoMoveNext && currentQuestionIndex < examQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 500); // 0.5 seconds delay
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleResultClick = () => {
    const allAnswered = userAnswers.every((answer) => answer !== null);
    if (!allAnswered) return;

    const totalQuestions = examQuestions.length;
    const passingPercentage = (correctAnswers / totalQuestions) * 100;
    const passStatus = passingPercentage >= 86.67;

    // Navigate to the result page with the updated state
    navigate("/result", {
      state: {
        correctAnswers,
        wrongAnswers,
        totalQuestions,
        examCode,
        selectedTopics, // Include selectedTopics
        selectedVehicle,
        passStatus,
      },
    });
  };

  const restartExam = () => {
    if (!selectedTopics || !selectedVehicle) {
      alert("Unable to restart exam. Missing required data.");
      return;
    }

    // Navigate to the /exam route with the required state
    navigate("/exam", {
      state: {
        selectedTopics,
        selectedVehicle,
        fromHome: true, // Ensure this state is passed
      },
      replace: true, // Replace the current entry in the history stack
    });

    // Reset all exam-related states
    setCurrentQuestionIndex(0);
    setUserAnswers(Array(examQuestions.length).fill(null));
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setTimeLeft(1800); // Reset timer to 30 minutes
    setShowFailModal(false); // Hide the fail modal
  };

  return (
    <div
      className="relative min-h-screen w-full text-white bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://wallpapers.com/images/hd/logo-background-zgqtb9n3ieqmc3fx.jpg')",
      }}
    >
      {/* Timer and Score */}
      <div className="bg-white grid grid-cols-11 items-center gap-[3px] p-[2px] shadow-md text-white">
        <div className="col-span-2 flex justify-center items-center bg-gray-800 h-12">
          <h2>
            Time Left: {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </h2>
        </div>
        <div className="col-span-2 flex justify-center items-center bg-gray-800 h-12">
          <h2 className="text-yellow-400 font-bold">
            {currentQuestionIndex + 1}/{examQuestions.length}
          </h2>
        </div>
        <div className="col-span-2 flex justify-center items-center bg-gray-800 h-12">
          <h2 className="text-green-500 font-bold"> {correctAnswers}</h2>
        </div>
        <div className="col-span-2 flex justify-center items-center bg-gray-800 h-12">
          <h2 className="text-red-500 font-bold"> {wrongAnswers}</h2>
        </div>
        <div className="col-span-2 flex justify-center items-center bg-gray-800 h-12">
          <h2 className="text-yellow-400 font-bold"> {examCode}</h2>
        </div>
        <div className="col-span-1 flex justify-center items-center bg-gray-800 h-12">
          <div className="flex justify-center items-center bg-gray-400 border border-[#DDDDDD] bg-[#16292F] p-2 rounded-full">
            <UsersRound className="text-white w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Question */}
      {examQuestions.length > 0 && (
        <div className="my-4">
          {/* Question image */}
          {examQuestions[currentQuestionIndex].image ? (
            <div className="w-[90%] h-[300px] mx-auto mb-4">
              <img
                src={examQuestions[currentQuestionIndex].image}
                alt="Question"
                className="w-full h-full object-cover"
              />
            </div>
          ) : null}
          <div className="border border-[#DDDDDD] bg-[#16292F] bg-opacity-40 mx-2 sm:mx-4 text-white p-3 rounded-sm mb-6">
            {examQuestions[currentQuestionIndex].question}
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-2">
            {examQuestions[currentQuestionIndex].options.map(
              (option, index) => (
                <div
                  key={index}
                  className="border border-[#DDDDDD] mx-2 sm:mx-4  text-white"
                >
                  <button
                    className={`text-[16px] sm:text-[18px] py-1 px-1 w-full text-start flex items-center justify-start gap-1
          ${
            userAnswers[currentQuestionIndex] !== null
              ? option === examQuestions[currentQuestionIndex].answer
                ? "bg-green-600"
                : userAnswers[currentQuestionIndex] === option
                ? "bg-red-600"
                : ""
              : "" // Apply opacity only to the background
          }
        `}
                    onClick={() => handleAnswerClick(option)}
                    disabled={userAnswers[currentQuestionIndex] !== null}
                  >
                    <span className="bg-white text-black text-center px-2 py-1 rounded-md shadow-lg font-bold">
                      {index + 1}
                    </span>
                    {option}
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {loading && <p>Loading questions...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="text-left">
        <div>
          {/* Auto Move Checkbox */}
          <div className="flex justify-end mt-4  fixed bottom-20 right-5">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoMoveNext}
                onChange={(e) => setAutoMoveNext(e.target.checked)}
                className="form-checkbox h-3 w-3 text-blue-600"
              />
              <span className="text-white text-sm">Automatic transition</span>
            </label>
          </div>
        </div>
      </div>
      <div className="md:fixed md:bottom-0 md:left-0 md:z-20 left-0 w-full bg-gray-900 p-3 flex justify-between items-center">
        {/* Previous Button */}
        <button
          className="px-3 py-1 border rounded-md bg-gray-800 text-white disabled:opacity-50"
          onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentQuestionIndex === 0}
        >
          ⬅️
        </button>

        {/* Index Number Buttons */}
        <div className="flex gap-2">
          {examQuestions[currentQuestionIndex]?.options.map((option, index) => (
            <button
              key={index}
              className={`px-4 py-2 border rounded-md text-white ${
                userAnswers[currentQuestionIndex] === option
                  ? "bg-blue-500" // Change color when selected
                  : "bg-gray-800" // Default color
              }`}
              onClick={() => handleAnswerClick(option)}
              disabled={userAnswers[currentQuestionIndex] !== null}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Next Button or View Result Button */}
        {currentQuestionIndex < examQuestions.length - 1 ? (
          <button
            className="px-3 py-1 border rounded-md bg-gray-800 text-white disabled:opacity-50"
            onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
            disabled={userAnswers[currentQuestionIndex] === null}
          >
            ➡️
          </button>
        ) : (
          <button
            className={`px-4 py-2 text-sm md:text-base md:font-bold rounded-md ${
              userAnswers.every((answer) => answer !== null)
                ? "bg-green-600 text-white"
                : "bg-gray-500 text-gray-300 cursor-not-allowed"
            }`}
            onClick={handleResultClick}
            disabled={!userAnswers.every((answer) => answer !== null)}
          >
            View Result
          </button>
        )}
      </div>

      {/* Fail Modal */}
      {showFailModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">You Failed!</h2>
            <p className="text-gray-700 mb-4">
              {timeLeft === 0
                ? "Time is up! You did not complete the exam in time."
                : "You have made 4 wrong answers. Please restart the exam."}
            </p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
              onClick={restartExam}
            >
              Restart Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exam;