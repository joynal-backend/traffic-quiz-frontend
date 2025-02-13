import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { UsersRound } from "lucide-react";


const Quiz = () => {
  const location = useLocation();
  const { selectedTopics ,selectedVehicle} = location.state || {};
  const navigate = useNavigate();

  const [examCode, setExamCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [examQuestions, setExamQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]); // Store answers
  const [timeLeft, setTimeLeft] = useState(600);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);

  useEffect(() => {
    const fetchSelectedQuestions = async () => {
      if (!selectedTopics || selectedTopics.size === 0) {
        setExamQuestions([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const query = [...selectedTopics].map(encodeURIComponent).join(",");
        const apiUrl = `https://traffic-master-backend.vercel.app/questions/all-questions?topics=${query}`;

        const result = await axios.get(apiUrl);
        setExamQuestions(result.data.slice(0, 10));

        const randomCode = `#${Math.random().toString(36).slice(-4).toUpperCase()}`;
        setExamCode(randomCode);

        setCurrentQuestionIndex(0);
        setUserAnswers(Array(result.data.length).fill(null)); // Initialize answers array
        setTimeLeft(600);
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
  }, [selectedTopics]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;
      if (key >= "1" && key <= "4") {
        const optionIndex = parseInt(key, 10) - 1;
        const currentOptions = examQuestions[currentQuestionIndex]?.options;
        if (currentOptions && optionIndex < currentOptions.length) {
          handleAnswerClick(currentOptions[optionIndex]);
        }
      } else if (key === "Enter") {
        if (currentQuestionIndex < examQuestions.length - 1 && userAnswers[currentQuestionIndex] !== null) {
          setCurrentQuestionIndex((prev) => prev + 1);
        }
      } else if (key === "ArrowRight") {
        if (currentQuestionIndex < examQuestions.length - 1 && userAnswers[currentQuestionIndex] !== null) {
          setCurrentQuestionIndex((prev) => prev + 1);
        }
      } else if (key === "ArrowLeft") {
        setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentQuestionIndex, examQuestions, userAnswers]);

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
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleResultClick = () => {
    navigate("/result", {
      state: { correctAnswers, wrongAnswers, totalQuestions: examQuestions.length, examCode, selectedVehicle }
    });
  };

  return (
    <div className="bg-[#193E4A] min-h-screen w-full  text-white">
      {/* Timer and Score */}
      <div className="bg-white grid grid-cols-11 items-center gap-[3px] p-[2px] shadow-md text-white">
        <div className="col-span-2 flex justify-center items-center bg-gray-800 h-12">
          <h2>
            Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </h2>
        </div>
        <div className="col-span-2 flex justify-center items-center bg-gray-800 h-12">
          <h1 className="text-yellow-400 font-bold"> {currentQuestionIndex + 1}/{examQuestions.length}</h1>
        </div>
        <div className="col-span-2 flex justify-center items-center bg-gray-800 h-12">
          <h1 className="text-green-500 font-bold"> {correctAnswers}</h1>
        </div>
        <div className="col-span-2 flex justify-center items-center bg-gray-800 h-12">
          <h1 className="text-red-500 font-bold"> {wrongAnswers}</h1>
        </div>
        <div className="col-span-2 flex justify-center items-center bg-gray-800 h-12">
          <h1 className="text-yellow-400 font-bold"> {examCode}</h1>
        </div>
        <div className="col-span-1 flex justify-center items-center bg-gray-800 h-12">
            <div className="flex justify-center items-center bg-gray-400 border border-[#DDDDDD] bg-[#16292F] p-2 rounded-full"> 

        <UsersRound className="text-white w-4 h-4 " />
            </div>
        </div>
      </div>

      {/* Question */}
      {examQuestions.length > 0 && (
        <div className="my-4">
          {/* Question image*/}
          {examQuestions[currentQuestionIndex].image ? (
  <div className="w-[90%] h-[300px] mx-auto mb-4">
    <img 
      //src={examQuestions[currentQuestionIndex].image} 
      src="https://thumbs.dreamstime.com/b/vector-illustration-streets-crossing-modern-city-crossroad-traffic-lights-markings-trees-sidewalk-pedestrians-127193280.jpg"
      alt="Question" 
      className="w-full h-full object-cover" 
    />
  </div>
) : null}
          <div className="border border-[#DDDDDD] bg-[#16292F] mx-2 sm:mx-4 text-white p-4 rounded-md mb-6">
            {examQuestions[currentQuestionIndex].question}
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-2">
            {examQuestions[currentQuestionIndex].options.map((option, index) => (
              <div key={index} className="border border-[#DDDDDD] mx-2 sm:mx-4 bg-gray-800 text-white">
                <button
                  className={` text-[16px] sm:text-[18px] py-2 px-1 w-full text-start flex items-center justify-start gap-1
                    ${userAnswers[currentQuestionIndex] !== null
                      ? option === examQuestions[currentQuestionIndex].answer
                        ? "bg-green-600"
                        : userAnswers[currentQuestionIndex] === option
                        ? "bg-red-600"
                        : "bg-gray-800"
                      : "bg-gray-800"}
                  `}
                  onClick={() => handleAnswerClick(option)}
                  disabled={userAnswers[currentQuestionIndex] !== null} 
                >
                  <span className="bg-white text-black text-center px-2 py-1 rounded-md shadow-lg font-bold">{index+1} </span>
              {option}
                </button>
              </div>
            ))}
          </div>

         
        </div>
      )}

      {loading && <p>Loading questions...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Pagination */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-900 p-3 flex justify-center items-center gap-2">
        <button
          className="px-3 py-1 border rounded-md bg-gray-800 text-white disabled:opacity-50"
          onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentQuestionIndex === 0}
        >
          ⬅️
        </button>

        {[...Array(examQuestions.length)].map((_, index) => (
          <button
            key={index}
            className={`px-3 py-1 border rounded-md ${
              index === currentQuestionIndex ? "bg-yellow-400" : "bg-gray-800 text-white"
            }`}
            onClick={() => setCurrentQuestionIndex(index)}
          >
            {index + 1}
          </button>
        ))}

        {currentQuestionIndex < examQuestions.length - 1 ? (
          <button
            className="px-3 py-1 border rounded-md bg-gray-800 text-white disabled:opacity-50"
            onClick={handleNextQuestion}
            disabled={userAnswers[currentQuestionIndex] === null} // Only enable if answered
          >
            ➡️
          </button>
        ) : (
          <button className="px-4 py-2 bg-green-600 text-white font-bold rounded-md" onClick={handleResultClick}>
            View Result
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
