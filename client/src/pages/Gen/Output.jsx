import React, { useEffect, useState } from "react";

const Output = () => {
  const [storyData, setStoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("generatedStoryPayload");
    if (!stored) {
      setLoading(false);
      return;
    }

    const payload = JSON.parse(stored);
    setMeta({
      title: payload.storyId.replace(/-/g, " "),
      genre: payload.genre,
      tone: payload.tone,
      audience: payload.audience
    });

    fetch("http://localhost:3000/api/genimg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((data) => {
        setStoryData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch image data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Loading your illustrated story...</p>
        </div>
      </div>
    );
  }

  if (!storyData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>No story data found. Please go back and generate one.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-5xl font-bold text-center text-indigo-700 mb-2">
        {meta.title.toUpperCase()}
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Genre: <strong>{meta.genre}</strong> | Tone: <strong>{meta.tone}</strong> | Audience: <strong>{meta.audience}</strong>
      </p>

      {/* ✅ Cover Image */}
      {storyData.cover?.image && (
        <div className="max-w-3xl mx-auto mb-10 text-center">
          <img
            src={`data:image/png;base64,${storyData.cover.image}`}
            alt="Cover illustration"
            className="w-full h-auto rounded-lg shadow-lg border border-gray-300"
          />
        </div>
      )}

      {/* ✅ Dynamic Story Sections */}
      <div className="max-w-4xl mx-auto space-y-10">
        {Object.entries(storyData)
          .filter(([key]) => key !== "cover")
          .map(([sectionKey, section]) => (
            <div key={sectionKey} className="bg-white p-6 rounded-lg shadow-md border border-indigo-100">
              <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
                {sectionKey.replace(/_/g, " ").toUpperCase()}
              </h2>
              <p className="text-gray-800 mb-4 whitespace-pre-line">
                {section.text}
              </p>
              {section.image && (
                <img
                  src={`data:image/png;base64,${section.image}`}
                  alt={`${sectionKey} visual`}
                  className="w-full h-auto rounded-md border border-gray-300"
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Output;