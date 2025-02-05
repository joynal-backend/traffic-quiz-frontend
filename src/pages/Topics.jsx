import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { Link } from "react-router-dom";

const Topics = () => {
  const vehicleOptions = [
    { value: "B, B1", label: "Light vehicle, quad bike" },
    { value: "A, A1", label: "Motorcycle, light motorcycle" },
    { value: "AM", label: "Moped and light quad bike" },
    { value: "C", label: "Truck" },
    { value: "C1", label: "Small truck" },
    { value: "D", label: "Bus" },
    { value: "D1", label: "Minibus" },
    { value: "T, S", label: "Agricultural and road construction machines" },
    { value: "Tram", label: "Tram" },
    { value: "B+C1 Mil", label: "B and C1 category for military personnel" },
  ];

  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState(new Set());
  const [selectedVehicle, setSelectedVehicle] = useState("Passenger car, ATV");

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const result = await axios.get("https://traffic-master-backend.vercel.app/questions/all-questions");
        const allTopics = result.data.map((question) => question.topics);
        const uniqueTopics = Array.from(new Set(allTopics));

        setTopics(uniqueTopics);
        setSelectedTopics(new Set(uniqueTopics)); // Automatically check all on load
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, []);

  const toggleAll = () => {
    setSelectedTopics(selectedTopics.size === topics.length ? new Set() : new Set(topics));
  };

  const toggleTopic = (topic) => {
    const newSelection = new Set(selectedTopics);
    newSelection.has(topic) ? newSelection.delete(topic) : newSelection.add(topic);
    setSelectedTopics(newSelection);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col justify-between items-center gap-2 mb-4">
        <Link 
        to="/exam"
        state={{
          selectedVehicle,
          selectedTopics,
        }}
        >
          
        <Button className="bg-blue-500 px-12 py-5 text-white hover:bg-blue-600">
          Start of the exam
        </Button>
        </Link>

        <Select onValueChange={setSelectedVehicle}>
          <SelectTrigger className="w-full bg-blue-500 text-white px-4 py-6 rounded-md flex items-center">
            <SelectValue placeholder={selectedVehicle} />
          </SelectTrigger>

          <SelectContent className="w-full py-4 bg-blue-600 text-white shadow-lg rounded-md">
            {vehicleOptions.map((option) => (
              <SelectItem
                key={option.value}
                className="px-4 py-2 w-full hover:bg-green-400 cursor-pointer"
                value={option.value}
              >
                <div className="flex place-items-center gap-2">
                  <Car size={35} className="mr-2" />
                  <span className="block font-bold">{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Topics Section */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Checkbox
            className={`peer ${selectedTopics.size === topics.length ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            checked={selectedTopics.size === topics.length}
            onCheckedChange={toggleAll}
          />
          <span className="ml-2">Mark/Unmark all</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {topics.map((topic, index) => (
            <div key={index} className="flex items-center gap-2">
              <Checkbox
                className={`peer ${selectedTopics.has(topic) ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                checked={selectedTopics.has(topic)}
                onCheckedChange={() => toggleTopic(topic)}
              />
              <div className="flex gap-2 text-justify">
                <h1>{index + 1}</h1>
                <h1>{topic}</h1>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Topics;
