import axios from "axios";
import { Loader2 } from "lucide-react"; // Import Loader2 for spinner
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false); // For fetching Users
  const [creatingAdmin, setCreatingAdmin] = useState(false); // For creating admin
  const [deletingAdmin, setDeletingAdmin] = useState(null); // Track which admin is being deleted
  const [updatingPassword, setUpdatingPassword] = useState(false); // For updating password
  const token = localStorage.getItem("token");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [role, setRole] = useState("admin");
  const [email, setEmail] = useState(""); // Add state for email
  const [forgotPasswordUsername, setForgotPasswordUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [editAdmin, setEditAdmin] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchUsers();
    }
  }, [token, navigate]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarOpen &&
        !event.target.closest(".sidebar") &&
        !event.target.closest(".menu-button")
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
      setUsers(response?.data?.data);
    } catch (error) {
      console.error("Failed to fetch Users", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (id) => {
    setDeletingAdmin(id); // Set the ID of the admin being deleted
    try {
      await axios.delete(
        `http://localhost:5000/api/users/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Admin deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete admin", error);
      toast.error("Failed to delete admin");
    } finally {
      setDeletingAdmin(null); // Reset the deleting state
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setCreatingAdmin(true);
    try {
      await axios.post(
        "http://localhost:5000/api/users/register",
        { username,email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Admin created successfully");
      fetchUsers();
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Failed to create admin", error);
      toast.error("Failed to create admin");
    } finally {
      setCreatingAdmin(false);
    }
  };

  // const handleUpdatePassword = async (e) => {
  //   e.preventDefault();
  //   setUpdatingPassword(true);
  //   try {
  //     const response = await axios.put(
  //       `http://localhost:5000/api/users/${id}`,
  //       {
          
  //       },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     toast.success(response.data.message);
  //     setForgotPasswordUsername("");
  //     setOldPassword("");
  //     setNewPassword("");
  //   } catch (error) {
  //     toast.error("Failed to reset password. Please check your credentials.");
  //     console.error("Failed to reset password", error);
  //   } finally {
  //     setUpdatingPassword(false);
  //   }
  // };

  return (
    <div>
      <ToastContainer /> {/* Add ToastContainer for toast notifications */}
      <ul>
        {users.map((user) => (
          <li
            key={user._id}
            className="flex items-center justify-between p-3 bg-white shadow-md rounded mb-2"
          >
            <span>{user.username}</span>
            <div className="flex gap-2">
              <button
                className="py-2 px-4 border bg-[#FEF9E1] text-black rounded flex items-center justify-center"
                onClick={() => setUserName(user.username)}
                disabled={deletingAdmin !== null || updatingPassword}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteAdmin(user._id)}
                className="p-2 bg-red-500 text-white rounded flex items-center justify-center"
                disabled={deletingAdmin !== null || updatingPassword}
              >
                {deletingAdmin === user._id ? ( // Show spinner only for the clicked delete button
                  <Loader2 className="animate-spin mr-2" />
                ) : null}
                {deletingAdmin === user._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Forget Password Form with Old Password */}
      {/* {userName && (
        <form onSubmit={handleUpdatePassword} className="mb-5">
          <h2 className="text-xl font-semibold">Edit Admin</h2>
          <input
            type="text"
            placeholder={userName}
            value={userName}
            className="p-2 border rounded w-full my-2"
            readOnly
          />
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="p-2 border rounded w-full my-2"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="p-2 border rounded w-full my-2"
            required
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded flex items-center justify-center"
            disabled={updatingPassword || deletingAdmin !== null}
          >
            {updatingPassword ? (
              <Loader2 className="animate-spin mr-2" />
            ) : null}
            {updatingPassword ? "Updating..." : "Reset Password"}
          </button>
        </form>
      )} */}

      <div>
        <form onSubmit={handleCreateAdmin} className="mb-5">
          <h2 className="text-xl font-semibold">Create Admin</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 border rounded w-full my-2"
            required
          />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Add input for email
            className="p-2 border rounded w-full my-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded w-full my-2"
            required
          />
         
          {/* <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="p-2 border rounded w-full my-2"
            required
          /> */}
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded flex items-center justify-center"
            disabled={creatingAdmin || deletingAdmin !== null || updatingPassword}
          >
            {creatingAdmin ? (
              <Loader2 className="animate-spin mr-2" />
            ) : null}
            {creatingAdmin ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;