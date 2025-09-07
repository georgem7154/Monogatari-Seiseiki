import React, { useEffect, useState, useRef } from "react";

const Textedit = () => {
  const [form, setForm] = useState(null);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState({});
  const [loading, setLoading] = useState(true);
  const sceneRefs = useRef({});

  useEffect(() => {
    const stored = localStorage.getItem("storyForm");
    if (stored) {
      const parsed = JSON.parse(stored);
      setForm(parsed);
      generateStoryFromAPI(parsed);
    } else {
      setLoading(false);
    }
  }, []);

  const generateStoryFromAPI = async ({ prompt, genre, tone, audience }) => {
    try {
      const res = await fetch("http://localhost:3000/api/genstory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, genre, tone, audience })
      });

      const data = await res.json();
      if (res.ok) {
        setTitle(data.title || "Untitled Story");
        const formatted = {
          "Scene 1": data.scene1,
          "Scene 2": data.scene2,
          "Scene 3": data.scene3,
          "Scene 4": data.scene4,
          "Scene 5": data.scene5
        };
        setStory(formatted);
      } else {
        console.error("❌ API error:", data.error || "Unknown error");
      }
    } catch (err) {
      console.error("❌ Failed to fetch story:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSceneEdit = (key, html) => {
    setStory((prev) => ({ ...prev, [key]: html }));
  };

  const handleGenerateImages = () => {
    const editedStory = {};
    Object.entries(sceneRefs.current).forEach(([key, ref]) => {
      if (ref?.innerText) {
        editedStory[key.toLowerCase().replace(" ", "")] = ref.innerText.trim();
      }
    });

    const payload = {
      userId: "gordon", // placeholder for now
      storyId: title.toLowerCase().replace(/\s+/g, "-"),
      genre: form.genre,
      tone: form.tone,
      audience: form.audience,
      story: editedStory
    };

    localStorage.setItem("generatedStoryPayload", JSON.stringify(payload));
    window.location.href = "http://localhost:5173/output";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Generating your story...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="p-6 text-center text-white bg-black min-h-screen">
        <p className="text-lg">No story data found. Please go back and generate one.</p>
        <a
          href="/"
          className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md"
        >
          🔙 Back to Generator
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="text-center mb-8">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-5xl font-bold text-indigo-700 bg-transparent border-none text-center w-full focus:outline-none"
        />
        <p className="text-lg text-gray-600 mt-2">✍️ Edit Your Story</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {Object.entries(story).map(([key, value]) => (
          <div
            key={key}
            className="bg-white p-4 rounded-lg shadow-md border border-indigo-100"
          >
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">
              {key}
            </h3>
            <div
              contentEditable
              suppressContentEditableWarning
              ref={(el) => (sceneRefs.current[key] = el)}
              onInput={(e) => handleSceneEdit(key, e.currentTarget.innerText)}
              className="w-full min-h-[6rem] p-3 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <button
          onClick={handleGenerateImages}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md"
        >
          🎬 Generate Images
        </button>
      </div>
    </div>
  );
};

export default Textedit;