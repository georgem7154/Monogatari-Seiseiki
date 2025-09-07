import React, { useEffect, useState } from "react";

const PublicStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStory, setActiveStory] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/publicstories")
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

  const handleCardClick = (storyId) => {
    fetch(`http://localhost:3000/api/publicstory/${storyId}`)
      .then((res) => res.json())
      .then((data) => {
        setActiveStory({ storyId, scenes: data });
      })
      .catch((err) => {
        console.error("❌ Failed to fetch full story:", err);
      });
  };

  const handleBack = () => {
    setActiveStory(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading public stories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      {!activeStory ? (
        <>
          <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">🌍 Public Stories</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {stories.map((story, index) => (
              <div
                key={index}
                onClick={() => handleCardClick(story.storyId)}
                className="cursor-pointer bg-gray-100 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                {story.cover && (
                  <img
                    src={`data:image/png;base64,${story.cover}`}
                    alt="Cover"
                    className="w-full h-48 object-cover rounded"
                  />
                )}
                <h2 className="text-xl font-semibold text-indigo-700 mt-4">
                  {story.title || story.storyId.replace(/_/g, " ").toUpperCase()}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Genre: <strong>{story.genre || "—"}</strong><br />
                  Tone: <strong>{story.tone || "—"}</strong><br />
                  Audience: <strong>{story.audience || "—"}</strong>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Published: {story.publishedAt ? new Date(story.publishedAt).toLocaleDateString() : "—"}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="max-w-4xl mx-auto mt-8 space-y-10">
          <button
            onClick={handleBack}
            className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
          >
            ← Back to Gallery
          </button>

          <h2 className="text-3xl font-bold text-indigo-700 text-center mb-6">
            {activeStory.storyId.replace(/_/g, " ").toUpperCase()}
          </h2>

          {/* Meta Scene */}
          {(() => {
            const meta = activeStory.scenes.find(s => s.sceneKey === "meta");
            return meta ? (
              <div className="bg-white p-6 rounded-lg shadow-md border border-indigo-100">
                <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Story Overview</h3>
                <p className="text-gray-800 mb-4 whitespace-pre-line">
                  <strong>Title:</strong> {meta.title}<br />
                  <strong>Genre:</strong> {meta.genre}<br />
                  <strong>Tone:</strong> {meta.tone}<br />
                  <strong>Audience:</strong> {meta.audience}
                </p>
                {meta.cover && (
                  <img
                    src={`data:image/png;base64,${meta.cover}`}
                    alt="Cover"
                    className="w-full h-auto rounded-md border border-gray-300"
                  />
                )}
              </div>
            ) : null;
          })()}

          {/* Story Scenes */}
          {activeStory.scenes
            .filter(scene => scene.sceneKey !== "meta")
            .map((scene, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-md border border-indigo-100">
                <h3 className="text-2xl font-semibold text-indigo-600 mb-4">
                  {scene.sceneKey.replace("scene", "Scene ").toUpperCase()}
                </h3>
                <p className="text-gray-800 mb-4 whitespace-pre-line">{scene.text}</p>
                {scene.image && (
                  <img
                    src={`data:image/png;base64,${scene.image}`}
                    alt={`${scene.sceneKey} visual`}
                    className="w-full h-auto rounded-md border border-gray-300"
                  />
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default PublicStories;