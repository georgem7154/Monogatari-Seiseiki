import React, { useEffect, useState } from "react";

const PublicStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/publicstories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStories(data);
        } else {
          console.error("Unexpected response:", data);
          setStories([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to load public stories:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading public stories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">🌍 Public Stories</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {stories.map((story, index) => {
          const meta = story.scenes.find(s => s.sceneKey === "meta");
          return (
            <div key={index} className="bg-gray-100 rounded-lg shadow-md p-4">
              {meta?.cover && (
                <img
                  src={`data:image/png;base64,${meta.cover}`}
                  alt="Cover"
                  className="w-full h-48 object-cover rounded"
                />
              )}
              <h2 className="text-xl font-semibold text-indigo-700 mt-4">
                {meta?.title || story.storyId.replace(/_/g, " ").toUpperCase()}
              </h2>
              <p className="text-sm text-gray-600 mt-1">Published by: <strong>{story.userId}</strong></p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(story.publishedAt).toLocaleDateString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PublicStories;