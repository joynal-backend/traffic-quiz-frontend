import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast for notifications
import { Loader2 } from "lucide-react"; // Import the spinner icon
import CreateQuestion from "./CreateQuestion";
import AdminTopics from "./AdminVehicle&Topics";

const AdminQuestions = ({
  questionTabActive,
  setQuestionTabActive,
  loading,
  setLoading,
}) => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(null); // Track which question is being deleted
  const questionsPerPage = 10;

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchQuestions();
      fetchTopics();
    }
  }, [token, navigate]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        "https://traffic-master-backend-bay.vercel.app/questions/all-questions"
      );

      // Reverse the questions array to show new data first
      const reversedQuestions = response.data.questions.reverse();

      setQuestions(reversedQuestions);
      setFilteredQuestions(reversedQuestions);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await axios.get(
        "https://traffic-master-backend-bay.vercel.app/topics/all-topics"
      );
      setTopics(response.data);
    } catch (error) {
      console.error("Failed to fetch topics", error);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [token, navigate]);

  const handleDeleteQuestion = async (id) => {
    setIsDeleting(id); // Set the ID of the question being deleted
    try {
      await axios.delete(
        `https://traffic-master-backend-bay.vercel.app/questions/delete-question/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Question deleted successfully!"); // Show success toast
      fetchQuestions(); // Refresh the questions list
    } catch (error) {
      console.error("Failed to delete question", error);
      toast.error("Failed to delete question."); // Show error toast
    } finally {
      setIsDeleting(null); // Reset the deleting state
    }
  };

  const filterQuestionsByTopic = (topic) => {
    setSelectedTopic(topic);
    setCurrentPage(1);
    if (topic === "all") {
      setFilteredQuestions(questions);
    } else {
      const filtered = questions.filter(
        (question) => question.topics?.toLowerCase() === topic.toLowerCase()
      );
      setFilteredQuestions(filtered);
    }
  };

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

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
      {questionTabActive === "all" && (
        <div className="p-5">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">Filter by Topic</h2>
            <select
              className="p-2 border rounded mt-2"
              value={selectedTopic}
              onChange={(e) => filterQuestionsByTopic(e.target.value)}
            >
              <option value="all">All Topics</option>
              {topics?.map((topic, index) => (
                <option key={index} value={topic.name}>
                  {topic.topic}
                </option>
              ))}
            </select>
          </div>

          <h2 className="text-xl font-semibold">All Questions</h2>
          <h2 className="mb-2 text-lg font-semibold">
            {filteredQuestions.length} questions found
          </h2>

          <div>
            {currentQuestions.length > 0 ? (
              currentQuestions.map((question) => (
                <ul
                  key={question._id}
                  className="mb-4 p-4 border rounded flex flex-col md:flex-row gap-3 justify-between list-none"
                >
                  <li>
                    {question.image && (
                      <img
                        src={question.image}
                        alt="Question"
                        className="w-64 h-24 object-cover mb-2"
                      />
                    )}
                    <h2 className=""><span className="font-semibold">Question: </span>{question.question}</h2>
                    <ul className="mt-2">
                      {question.options?.map((option, index) => (
                        <li key={index}> <span>Option {index + 1}: </span>
                          {option}{" "}
                          {index === question.correctOption &&
                            "(Correct Answer)"}
                        </li>
                      ))}
                    </ul>
                    <h2 className=""><span className="font-semibold">Correct Option: </span>{question.answer}</h2>
                  </li>
                  <li>
                    <button
                      onClick={() => handleDeleteQuestion(question._id)}
                      className="px-8 py-2 md:px-4 bg-red-500 text-white rounded flex items-center justify-center"
                      disabled={isDeleting === question._id} // Disable only the clicked button
                    >
                      {isDeleting === question._id ? ( // Show spinner only for the clicked button
                        <Loader2 className="animate-spin mr-2" />
                      ) : null}
                      {isDeleting === question._id ? "Deleting..." : "Delete"}
                    </button>
                  </li>
                </ul>
              ))
            ) : (
              <p>No questions found for the selected topic.</p>
            )}
          </div>

          <div className="flex justify-center mt-4 space-x-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`p-2 ${
                currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
              } rounded`}
            >
              Previous
            </button>
            <span className="p-2">
              Page {currentPage} of{" "}
              {Math.ceil(filteredQuestions.length / questionsPerPage)}
            </span>
            <button
              onClick={nextPage}
              disabled={
                currentPage ===
                Math.ceil(filteredQuestions.length / questionsPerPage)
              }
              className={`p-2 ${
                currentPage ===
                Math.ceil(filteredQuestions.length / questionsPerPage)
                  ? "bg-gray-300"
                  : "bg-blue-500 text-white"
              } rounded`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {questionTabActive === "create" && (
        <div>
          <CreateQuestion onQuestionCreated={fetchQuestions} onTopicCreated={fetchTopics} />
        </div>
      )}

      {questionTabActive === "topics" && (
        <AdminTopics onTopicCreated={fetchTopics} />
      )}
    </div>
  );
};

export default AdminQuestions;