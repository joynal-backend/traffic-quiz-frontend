import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; // Import the spinner icon

const AdminTopics = ({ onTopicCreated }) => {
  const navigate = useNavigate();
  const [topicField, setTopicField] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [vehicleName, setVehicleName] = useState("");
  const [vehicles, setVehicles] = useState();
  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(null);
  const [isCreatingTopic, setIsCreatingTopic] = useState(false); // Loading state for topic creation
  const [isCreatingVehicle, setIsCreatingVehicle] = useState(false); // Loading state for vehicle creation

  const token = localStorage.getItem("token");

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

  const fetchVehicles = async () => {
    try {
      const response = await axios.get("https://traffic-master-backend-bay.vercel.app/vehicles/all");
      setVehicles(response.data);
    } catch (error) {
      console.error("Failed to fetch vehicles", error);
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchVehicles();
  }, [token, navigate, vehicleName]);

  const handleVehicleChange = (vehicle) => {
    setSelectedVehicles((prev) =>
      prev.includes(vehicle)
        ? prev.filter((v) => v !== vehicle)
        : [...prev, vehicle]
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleVehicleCreate = async (e) => {
    e.preventDefault();
    if (vehicleName === "") {
      toast.error("Please enter a vehicle name.");
      return;
    }

    setIsCreatingVehicle(true); // Start loading

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
        toast.error("Failed to upload image.");
        setIsCreatingVehicle(false); // Stop loading on error
        return;
      }
    }

    try {
      await axios.post(
        "https://traffic-master-backend-bay.vercel.app/vehicles/create",
        { vehicle: vehicleName, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onTopicCreated();
      toast.success("Vehicle created successfully");
      setVehicleName("");
      setImage(null);
      setImagePreview(null);
      fetchVehicles();
    } catch (error) {
      toast.error(
        error.response.data?.error || "Failed to create vehicle"
      );
      console.error("Failed to create vehicle", error);
    } finally {
      setIsCreatingVehicle(false); // Stop loading
    }
  };

  const handleDeleteVehicle = async (id) => {
    try {
      await axios.delete(`https://traffic-master-backend-bay.vercel.app/vehicles/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Vehicle deleted successfully");
      fetchVehicles();
    } catch (error) {
      console.error("Failed to delete vehicle", error);
    }
  };

  const handleTopicCreate = async (e) => {
    e.preventDefault();
    if (selectedVehicles.length === 0) {
      toast.error("Please select at least one vehicle type.");
      return;
    }

    setIsCreatingTopic(true); // Start loading

    try {
      await axios.post(
        "https://traffic-master-backend-bay.vercel.app/topics/create",
        { vehicleType: selectedVehicles, topic: topicField },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onTopicCreated();
      toast.success("Topic created successfully");
      setTopicField("");
      setSelectedVehicles([]);
      fetchTopics();
    } catch (error) {
      toast.error(error.response.data?.error || "Failed to create topic");
      console.error("Failed to create topic", error);
    } finally {
      setIsCreatingTopic(false); // Stop loading
    }
  };

  const handleDeleteTopic = async (id) => {
    try {
      await axios.delete(`https://traffic-master-backend-bay.vercel.app/topics/delete-topic/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Topic deleted successfully");
      fetchTopics();
    } catch (error) {
      console.error("Failed to delete topic", error);
    }
  };

  return (
    <div>
    <ToastContainer
        className="toast-position"
        position="top-center"
        autoClose={8000}
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
        className="mb-5 w-full bg-gradient-to-br from-blue-50 to-purple-50 p-6"
        onSubmit={handleTopicCreate}
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Select Vehicle Type(s)
          </label>
          <div className="flex flex-wrap gap-2">
            {vehicles?.length ? (
              vehicles.map((vehicle) => (
                <label key={vehicle._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={vehicle.vehicle}
                    checked={selectedVehicles.includes(vehicle.vehicle)}
                    onChange={() => handleVehicleChange(vehicle.vehicle)}
                  />
                  {vehicle.vehicle}
                </label>
              ))
            ) : (
              <p>Loading vehicles...</p>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Topic Name
          </label>
          <input
            type="text"
            value={topicField}
            onChange={(e) => setTopicField(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
          disabled={isCreatingTopic} // Disable button when loading
        >
          {isCreatingTopic ? (
            <Loader2 className="animate-spin mr-2" /> // Show spinner when loading
          ) : null}
          {isCreatingTopic ? "Creating..." : "Create Topic"}
        </button>
      </form>

      <form
        className="mb-5 w-full bg-gradient-to-br from-blue-50 to-purple-50 p-6"
        onSubmit={handleVehicleCreate}
      >
        <h2 className="text-2xl text-gray-800 mb-6">Add New Vehicle</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle Name
          </label>
          <input
            type="text"
            value={vehicleName}
            onChange={(e) => setVehicleName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-48 h-24 object-cover rounded-lg mb-4"
          />
        )}

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
          disabled={isCreatingVehicle} // Disable button when loading
        >
          {isCreatingVehicle ? (
            <Loader2 className="animate-spin mr-2" /> // Show spinner when loading
          ) : null}
          {isCreatingVehicle ? "Creating..." : "Create Vehicle"}
        </button>
      </form>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Topics List</h2>
          <Table className="max-w-xl bg-[#F8E7F6] text-sm border-collapse border border-[#DDDDDD] rounded-lg shadow-lg">
            <TableCaption className="text-lg font-semibold py-2">
              A list of all the topics
            </TableCaption>
            <TableHeader className="bg-purple-200">
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Vehicles</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.map((topic, index) => (
                <TableRow key={topic._id} className="hover:bg-purple-100">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{topic.topic}</TableCell>
                  <TableCell className="font-medium border-r border-gray-300">
                    {Array.isArray(topic.vehicleType)
                      ? topic.vehicleType.join(", ")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="w-full bg-white rounded-lg text-black">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the topic.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteTopic(topic._id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="bg-purple-200">
                <TableCell colSpan={4} className="text-center font-semibold py-2">
                  {topics.length} Topics found
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">Vehicles List</h2>
          <Table className="w-full bg-[#F8E7F6] text-sm border-collapse border border-[#DDDDDD] rounded-lg shadow-lg">
            <TableCaption className="text-lg font-semibold py-2">
              A list of all the vehicles
            </TableCaption>
            <TableHeader className="bg-purple-200">
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Vehicles</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles?.map((vehicle, index) => (
                <TableRow key={vehicle._id} className="hover:bg-purple-100">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{vehicle.vehicle}</TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="w-full bg-white rounded-lg text-black">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the vehicle.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteVehicle(vehicle._id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="bg-purple-200">
                <TableCell colSpan={4} className="text-center font-semibold py-2">
                  {vehicles?.length} Vehicles found
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminTopics;