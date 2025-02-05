import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Result = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const { correctAnswers, wrongAnswers, totalQuestions, examCode, selectedVehicle } = location.state || {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Exam Result</h1>
      <p className="text-xl">Vehicle Type: <span className="text-yellow-400">{selectedVehicle}</span></p>
      <p className="text-xl">Exam Code: <span className="text-yellow-400">{examCode}</span></p>
      <p className="text-green-400 text-lg">Correct Answers: {correctAnswers}</p>
      <p className="text-red-400 text-lg">Wrong Answers: {wrongAnswers}</p>
      <p className="text-lg">Total Questions: {totalQuestions}</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white font-bold rounded-md"
        onClick={() => navigate("/")}
      >
        Go Home
      </button>
    </div>
  );
};

export default Result;
