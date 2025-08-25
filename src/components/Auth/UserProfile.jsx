import { useState, useEffect } from "react";
import { getCurrentUser, updateUserProfile } from "../../lib/auth";

const UserProfile = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setUsername(currentUser?.user_metadata?.username || "");
    };
    loadUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await updateUserProfile({ username });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Profile updated successfully!");
      setTimeout(() => onClose?.(), 1500);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Update Profile</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full p-2 border rounded"
              maxLength="100"
            />
          </div>

          {message && (
            <p
              className={`text-sm ${
                message.includes("success") ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
