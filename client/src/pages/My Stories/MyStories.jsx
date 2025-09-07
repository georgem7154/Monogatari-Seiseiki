import React, { useEffect, useState } from "react";

const MyStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔍 Get authenticated userId
    fetch("/user/find/userbyemail", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((userData) => {
        const userId = userData?.userId || "george123";

        // 🔥 Fetch all stories for this user
        return fetch(`http://localhost:3000/api/getfullstory/${userId}`);
      })
      .then((res) => res.json())
      .then((data) => {
        setStories(data); // Expecting array of { title, cover, genre, tone, audience }
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch stories:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Loading your stories...</p>
        </div>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>No stories found for this user.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">
        📚 My Stories
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {stories.map((story, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md border border-indigo-100 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {story.cover && (
              <img
                src={`data:image/png;base64,${story.cover}`}
                alt={`${story.title} cover`}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold text-indigo-700 mb-2">
                {story.title}
              </h2>
              <p className="text-sm text-gray-600">
                Genre: <strong>{story.genre}</strong>
                <br />
                Tone: <strong>{story.tone}</strong>
                <br />
                Audience: <strong>{story.audience}</strong>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyStories;
