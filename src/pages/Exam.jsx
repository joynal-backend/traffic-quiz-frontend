import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Exam = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State variables
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [examQuestions, setExamQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [autoMoveNext, setAutoMoveNext] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);

  // Extract selected topics and vehicle from location state
  const { selectedTopics, selectedVehicle } = location.state || {};


  // Fisher-Yates Shuffle Algorithm
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Fetch and shuffle questions
  const fetchAndShuffleQuestions = useCallback(async () => {
    setLoading(true);


    try {
      const topicsQuery = selectedTopics.join(","); // Convert array to comma-separated string
      const vehicleQuery = selectedVehicle; // Assuming `selectedVehicle` is already a string or ID

      // Fetch questions from the backend
      const apiUrl = "http://localhost:5000/api/questions";
      const response = await axios.get(apiUrl);

      if (response?.data) {
        // Filter questions by both vehicle and topics
        const filteredQuestions = response.data.filter(
          (question) =>
            question.vehicles.some((vehicle) => vehicle._id === vehicleQuery) &&
            topicsQuery.split(",").includes(question.topic._id)
        );

        // Shuffle the filtered questions
        const shuffledQuestions = shuffleArray(filteredQuestions);

        // Determine the number of questions based on vehicle category
       const  vehicleUrl= `http://localhost:5000/api/vehicles/${selectedVehicle}`;
       const responseVehicle = await axios.get(vehicleUrl);
       console.log(responseVehicle,"responseVehicle");
       const vehicleName = responseVehicle?.data?.name;
      
 //     const checkVehicleName =
        const checkQuestionCategory = vehicleName.split(" ")[0];
        const includesCorD =
          checkQuestionCategory.toLowerCase().includes("c") ||
          checkQuestionCategory.toLowerCase().includes("d");
          console.log(includesCorD);
        const questionLimit = includesCorD ? 40 : 30;

        // Select the first `questionLimit` questions
        const selectedQuestions = shuffledQuestions.slice(0, questionLimit);

        setExamQuestions(selectedQuestions);
        setUserAnswers(Array(selectedQuestions.length).fill(null));
        setCurrentQuestionIndex(0);
        setCorrectAnswers(0);
        setWrongAnswers(0);
        setTimeLeft(includesCorD ? 2400 : 1800); // Reset timer
      } else {
        setError("No questions found in the database.");
      }
    } catch (error) {
      console.error("API Error:", error);
      setError("Failed to fetch questions.");
    } finally {
      setLoading(false);
    }
  }, [selectedTopics, selectedVehicle]);

  // Fetch questions when the component mounts
  useEffect(() => {
    if (!selectedTopics || !selectedVehicle) {
      navigate("/", { replace: true });
    } else {
      fetchAndShuffleQuestions();
    }
  }, [fetchAndShuffleQuestions, selectedTopics, selectedVehicle, navigate]);

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setShowFailModal(true);
    }
  }, [timeLeft]);

  // Handle answer selection
  const handleAnswerClick = (option) => {
    if (userAnswers[currentQuestionIndex] !== null) return;

    const correctAnswer = examQuestions[currentQuestionIndex].correctAnswer;
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = option;
    setUserAnswers(updatedAnswers);

    if (option === correctAnswer) {
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setWrongAnswers((prev) => prev + 1);

      const checkQuestionCategory = selectedVehicle.split(" ")[0];
      const includesCorD =
        checkQuestionCategory.toLowerCase().includes("c") ||
        checkQuestionCategory.toLowerCase().includes("d");

      const maxWrongAnswers = includesCorD ? 5 : 4;
      if (wrongAnswers + 1 >= maxWrongAnswers) {
        setShowFailModal(true);
      }
    }

    if (autoMoveNext && currentQuestionIndex < examQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 500);
    }
  };

  // Handle result submission
  const handleResultClick = () => {
    const allAnswered = userAnswers.every((answer) => answer !== null);
    if (!allAnswered) return;

    const totalQuestions = examQuestions.length;
    const passingPercentage = (correctAnswers / totalQuestions) * 100;
    const passStatus = passingPercentage >= 86.67;

    navigate("/result", {
      state: {
        correctAnswers,
        wrongAnswers,
        totalQuestions,
        selectedTopics,
        selectedVehicle,
        passStatus,
      },
    });
  };

  // Restart the exam
  const restartExam = () => {
    if (!selectedTopics || !selectedVehicle) {
      alert("Unable to restart exam. Missing required data.");
      return;
    }

    // Fetch a new set of randomized questions
    fetchAndShuffleQuestions();

    // Reset states
    setShowFailModal(false);
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
      <div className="bg-white grid grid-cols-12 md:grid-cols-11 items-center gap-[3px] p-[2px] shadow-md text-white">
        <div className="col-span-2 flex justify-center items-center bg-gray-800 h-12">
          <h2 className="text-sm md:text-base">
            {Math.floor(timeLeft / 60)}:
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
          <h2 className="text-yellow-400 text-[10px] md:text-sm text-center">
            {" "}
            ავტოსკოლა ვარკეთილში
          </h2>
        </div>
        <div className="col-span-2 md:col-span-1 flex justify-center items-center bg-gray-800 h-12">
          <div className="flex justify-center items-center bg-[#16292F] p-2">
            <Link
              to="https://avtoskola-varketilshi.ge/"
              className="flex gap-1 font-bold hover:text-green-500"
            >
              <img
                src="https://res.cloudinary.com/deyqhzw8p/image/upload/v1740718868/eaz6oqcsd5wa880g9kvl.png"
                alt="Logo"
                className="w-8 h-8 bg-white rounded-full border-2 border-[#DDDDDD]"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Question Section */}
      {examQuestions.length > 0 && (
        <div className="my-4">
          <div>
            {examQuestions[currentQuestionIndex].photo && (
              <div className="w-[90%] h-auto mx-auto mb-4">
                <img
                  src={examQuestions[currentQuestionIndex].photo}
                  alt="Question"
                  className="w-full h-auto max-h-96 mx-auto object-contain"
                />
              </div>
            )}
            <div className="border border-[#DDDDDD] bg-[#16292F] bg-opacity-40 mx-2 sm:mx-4 text-white p-3 rounded-sm mb-6">
              {examQuestions[currentQuestionIndex].title}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-2">
            {examQuestions[currentQuestionIndex].options.map((option, index) => (
              <div key={index} className="border border-[#DDDDDD] mx-2 sm:mx-4 text-white">
                <button
                  className={`text-[16px] sm:text-[18px] py-1 px-1 w-full text-start flex items-center justify-start gap-1
                    ${
                      userAnswers[currentQuestionIndex] !== null
                        ? option === examQuestions[currentQuestionIndex].correctAnswer
                          ? "bg-green-600"
                          : userAnswers[currentQuestionIndex] === option
                          ? "bg-red-600"
                          : ""
                        : ""
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
            ))}
          </div>
        </div>
      )}

      {loading && <p>Loading questions...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Auto Move Next Checkbox */}
      <div className="text-left my-3">
        <div>
          <div className="flex justify-end mt-4 lg:fixed lg:bottom-20 lg:right-5">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoMoveNext}
                onChange={(e) => setAutoMoveNext(e.target.checked)}
                className="form-checkbox h-3 w-3 text-blue-600"
              />
              <span className="text-white text-sm">ავტომატურად გადასვლა</span>
            </label>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="w-full bg-gray-900 p-3 flex justify-between items-center static md:bottom-0 md:left-0 right-0 md:fixed">
        {/* Previous Button */}
        <button
          className="px-3 py-1 border rounded-md bg-gray-800 text-white disabled:opacity-50"
          onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentQuestionIndex === 0}
        >
          ⬅️
        </button>

        {/* Option Buttons */}
        <div className="flex gap-2">
          {examQuestions[currentQuestionIndex]?.options.map((option, index) => (
            <button
              key={index}
              className={`px-4 py-2 border rounded-md text-white ${
                userAnswers[currentQuestionIndex] === option
                  ? "bg-blue-500"
                  : "bg-gray-800"
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
            ნახე შედეგები
          </button>
        )}
      </div>

      {/* Fail Modal */}
      {showFailModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-2 rounded-lg text-center mx-auto max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">ვერ ჩააბარე!</h2>
            <div>
              {timeLeft === 0 ? (
                <img
                  src="https://res.cloudinary.com/deyqhzw8p/image/upload/v1741181253/sklpdwdpmzz3z3n3bdi1.gif"
                  alt="Fail"
                  className="w-full h-56 mx-auto"
                />
              ) : (
                <img
                  src="https://res.cloudinary.com/deyqhzw8p/image/upload/v1740923531/dfgkm2b92881lb0zqgfe.png"
                  alt="Fail"
                  className="w-28 h-28 mx-auto"
                />
              )}
            </div>
            <p className="text-gray-700 mb-4">
              {timeLeft === 0 ? (
                <span className="flex flex-col justify-center items-center text-nowrap">
                  <span>"ჰმმმ!გავიდა დრო,</span>
                  <span className="text-center text-wrap">
                    გავიდა დრო,სამწუხაროდ ჩაიჭერი გამოცდაში.თავიდან დაწყება
                  </span>
                </span>
              ) : (
                "არ დანებდე... კიდევ სცადე...ეცადე ის თემები გადაიმერო, რაც გერთულება"
              )}
            </p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
              onClick={restartExam}
            >
              ახლიდან დაწყება
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exam;