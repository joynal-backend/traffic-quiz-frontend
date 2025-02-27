import { useLocation, useNavigate } from "react-router-dom";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    correctAnswers,
    wrongAnswers,
    totalQuestions,
    examCode,
    selectedTopics,
    selectedVehicle,
    passStatus,
  } = location.state || {};

  // Function to restart the exam
  const handleRestartExam = () => {
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
  };

  // Function to go to the home page
  const handleGoToHome = () => {
    navigate("/");
  };

  // Function to print the result
  const handlePrintResult = () => {
    window.print();
  };

  return (
    <div className="bg-[#193E4A] min-h-screen w-full text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Exam Result</h2>
      <div className="bg-[#16292F] p-4 rounded-md">
        <p>Exam Code: {examCode}</p>
        <p>Vehicle: {selectedVehicle}</p>
        <p>Correct Answers: {correctAnswers}</p>
        <p>Wrong Answers: {wrongAnswers}</p>
        <p>Total Questions: {totalQuestions}</p>
        <p>Passing Percentage: {((correctAnswers / totalQuestions) * 100).toFixed(2)}%</p>
        <p className={`text-${passStatus ? 'green' : 'red'}-500 font-bold`}>
          {passStatus ? "Congratulations! You passed." : "Sorry, you failed."}
        </p>

        {/* Buttons based on passStatus */}
        <div className="mt-4">
          {!passStatus && (
            <button
              onClick={handleRestartExam}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Restart Exam
            </button>
          )}
          {passStatus && (
            <button
              onClick={handleGoToHome}
              className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Go to Home
            </button>
          )}
          <button
            onClick={handlePrintResult}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
          >
            Print Result
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;