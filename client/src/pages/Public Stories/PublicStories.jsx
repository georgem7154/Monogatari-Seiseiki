import { useEffect, useState } from "react";

function PublicStories() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/user/find/userbyemail", {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error("❌ Failed to fetch user:", err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>👤 Logged-in User</h2>
      {user ? (
        <div>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Username:</strong> {user.user_name}</p>
          <p><strong>User ID:</strong> {user.userId}</p> {/* 🔥 Added line */}
        </div>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
}

export default PublicStories;