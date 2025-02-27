import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState(new Set());
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [allSelected, setAllSelected] = useState(true);
  const [loadingVehicles, setLoadingVehicles] = useState(false); // Loading state for vehicles
  const [loadingTopics, setLoadingTopics] = useState(false); // Loading state for topics

  console.log(selectedTopics);

  // Handle quiz start
  const handleStartQuiz = () => {
    if (selectedTopics.size === 0) {
      alert("Please select at least one topic before starting the exam.");
      return;
    }
    navigate("/exam", {
      state: {
        selectedTopics: Array.from(selectedTopics),
        selectedVehicle,
        fromHome: true,
      },
    });
  };

  // Fetch available vehicles on component mount
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoadingVehicles(true); // Set loading state for vehicles
      try {
        const response = await axios.get("https://traffic-master-backend-bay.vercel.app/vehicles/all");
        setVehicles(response.data);
        if (response.data.length > 0) {
          setSelectedVehicle(response.data[0].vehicle);
        }
      } catch (error) {
        console.error("Failed to fetch vehicles", error);
      } finally {
        setLoadingVehicles(false); // Reset loading state for vehicles
      }
    };
    fetchVehicles();
  }, []);

  // Fetch topics based on selected vehicle
  useEffect(() => {
    const fetchTopics = async () => {
      if (!selectedVehicle) return; // Don't fetch if no vehicle is selected

      setLoadingTopics(true); // Set loading state for topics
      try {
        const response = await axios.get(
          `https://traffic-master-backend-bay.vercel.app/topics/all-topics?vehicleType=${selectedVehicle}`
        );
        setTopics(response.data);
        setSelectedTopics(new Set(response.data.map((t) => t.topic)));
        setAllSelected(true);
      } catch (error) {
        console.error("Failed to fetch topics", error);
        setTopics([]); // Reset topics if there's an error
      } finally {
        setLoadingTopics(false); // Reset loading state for topics
      }
    };

    fetchTopics();
  }, [selectedVehicle]);

  // Handle topic selection toggle
  const toggleTopic = (topic) => {
    const newSelection = new Set(selectedTopics);
    if (newSelection.has(topic.topic)) {
      newSelection.delete(topic.topic);
    } else {
      newSelection.add(topic.topic);
    }
    setSelectedTopics(newSelection);
    setAllSelected(newSelection.size === topics.length);
  };

  // Mark all/unmark all topics
  const toggleAllTopics = () => {
    if (allSelected) {
      setSelectedTopics(new Set());
      setAllSelected(false);
    } else {
      setSelectedTopics(new Set(topics.map((t) => t.topic)));
      setAllSelected(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Loading state for vehicles */}
      {loadingVehicles ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-[#BE3144]">Loading vehicles...</p>
        </div>
      ) : (
        <div>
          <div className="flex flex-col justify-between items-center gap-2 mb-4">
            <Button
              className="bg-[#BE3144] text-black px-12 text-sm md:text-base py-5 hover:bg-[#F72C5B]"
              onClick={handleStartQuiz}
            >
              <span className="text-sm lg:text-base">Start of the exam</span>
            </Button>

            <Select onValueChange={setSelectedVehicle} value={selectedVehicle}>
              <SelectTrigger className="w-full bg-[#BE3144] text-sm md:text-base text-black px-4 py-6 rounded-md flex items-center">
                <SelectValue placeholder={selectedVehicle} />
              </SelectTrigger>
              <SelectContent className="w-full py-4 bg-[#BE3144] text-sm md:text-base text-white shadow-lg rounded-md">
                {vehicles.map((vehicle) => (
                  <SelectItem
                    key={vehicle._id}
                    className="px-4 py-2 w-full text-sm md:text-base hover:bg-green-400 cursor-pointer"
                    value={vehicle.vehicle}
                  >
                    <div className="flex place-items-center gap-2">
                      <img src={vehicle.imageUrl} alt="vehicle" className="w-16 h-6 object-cover" />
                      <span className="block font-bold text-sm md:text-base">{vehicle.vehicle}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Loading state for topics */}
          {loadingTopics ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-[#BE3144]">Loading topics...</p>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg p-4">
              {topics.length === 0 ? ( // Show message if no topics are available
                <div className="text-center text-gray-500">No topics available for this vehicle.</div>
              ) : (
                <>
                  <div className="flex justify-center mb-4 items-center gap-2">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={toggleAllTopics}
                      className={`peer ${allSelected ? "bg-[#BE3144] text-white" : "bg-gray-200"}`}
                    />
                    <span className="ml-2 text-[14px] font-bold leading-[21px]">Mark/Unmark all</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[rgb(33,37,41)]">
                    {topics.map((topic, index) => (
                      <div key={index} className="flex items-center gap-2 mx-0 md:mx-14 text-sm md:text-sm lg:text-base font-semibold leading-[21px]">
                        <Checkbox
                          className={`peer ${selectedTopics.has(topic.topic) ? "bg-[#BE3144] text-white" : "bg-gray-200"}`}
                          checked={selectedTopics.has(topic.topic)}
                          onCheckedChange={() => toggleTopic(topic)}
                        />
                        <p>{index + 1}</p>
                        <p>{topic.topic}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;