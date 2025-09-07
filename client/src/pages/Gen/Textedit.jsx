import React, { useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { easing } from "maath";

// 🌌 Moving Stars Background
function MovingStars() {
  const ref = useRef();

  useFrame((state, delta) => {
    // Smoothly rotate towards mouse position
    easing.damp3(
      ref.current.rotation,
      [state.mouse.y * 0.1, state.mouse.x * 0.1, 0],
      0.25,
      delta
    );
  });

  return (
    <group ref={ref}>
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={7}
        saturation={1}
        fade
        speed={1}
      />
    </group>
  );
}

// Loading Component with animation
const StoryLoadingAnimation = () => {
  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-90 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="relative">
        {/* Main spinner */}
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        
        {/* Orbiting elements */}
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-purple-500 rounded-full animate-ping opacity-75"></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-pink-500 rounded-full animate-pulse"></div>
        
        {/* Floating elements */}
        <div className="absolute -top-8 left-6 w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        <div className="absolute -right-8 top-6 w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
      </div>
      
      <p className="mt-6 text-yellow-300 font-medium text-lg">Generating your story...</p>
      <p className="text-gray-300 mt-2">This will just take a moment</p>
      
      {/* Decorative elements */}
      <div className="absolute bottom-10 left-10 opacity-20">
        <svg width="100" height="100" viewBox="0 0 100 100" className="animate-pulse">
          <path d="M25,25 Q50,0 75,25 Q100,50 75,75 Q50,100 25,75 Q0,50 25,25" fill="none" stroke="purple" strokeWidth="2"/>
        </svg>
      </div>
      
      <div className="absolute top-10 right-10 opacity-20">
        <svg width="80" height="80" viewBox="0 0 80 80" className="animate-spin" style={{animationDuration: '8s'}}>
          <circle cx="40" cy="40" r="35" fill="none" stroke="indigo" strokeWidth="2" strokeDasharray="10,10"/>
        </svg>
      </div>
    </div>
  );
};

const Textedit = () => {
  const [form, setForm] = useState(null);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingStates, setEditingStates] = useState({});
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
        const storyData = {
          scene1: data.scene1,
          scene2: data.scene2,
          scene3: data.scene3,
          scene4: data.scene4,
          scene5: data.scene5
        };
        setStory(storyData);
        
        // Initialize editing states
        const initialEditingStates = {};
        Object.keys(storyData).forEach(key => {
          initialEditingStates[key] = false;
        });
        setEditingStates(initialEditingStates);
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
    setStory((prev) => ({
      ...prev,
      [key]: html
    }));
  };

  const handleSceneFocus = (key) => {
    setEditingStates(prev => ({
      ...prev,
      [key]: true
    }));
  };

  const handleSceneBlur = (key, event) => {
    setEditingStates(prev => ({
      ...prev,
      [key]: false
    }));
    handleSceneEdit(key, event.currentTarget.innerHTML);
  };

  const handleKeyDown = (event) => {
    // Allow default behavior for all keys except Enter
    if (event.key === 'Enter') {
      event.preventDefault();
      document.execCommand('insertLineBreak');
    }
  };

  const handleGenerateImages = () => {
    const editedStory = {
      title: title.trim()
    };

    Object.entries(sceneRefs.current).forEach(([key, ref]) => {
      if (ref?.innerText) {
        const sceneKey = key.toLowerCase().replace(/\s+/g, ""); // "Scene 1" → "scene1"
        editedStory[sceneKey] = ref.innerText.trim();
      }
    });

    const payload = {
      userId: "george123",
      storyId: title.toLowerCase().replace(/\s+/g, "_"),
      genre: form.genre,
      tone: form.tone,
      audience: form.audience,
      story: editedStory
    };

    localStorage.setItem("generatedStoryPayload", JSON.stringify(payload));
    window.location.href = "/output";
  };

  if (loading) {
    return (
      <div className="relative min-h-screen text-white bg-slate-900 overflow-hidden">
        {/* 🌌 Starfield Background */}
        <div className="absolute inset-0 z-0 h-full w-full">
          <Canvas style={{ height: "100%", width: "100%" }}>
            <fog attach="fog" args={["#0f172a", 0, 70]} />
            <MovingStars />
          </Canvas>
        </div>
        <StoryLoadingAnimation />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="relative min-h-screen text-white bg-slate-900 overflow-hidden">
        {/* 🌌 Starfield Background */}
        <div className="absolute inset-0 z-0 h-full w-full">
          <Canvas style={{ height: "100%", width: "100%" }}>
            <fog attach="fog" args={["#0f172a", 0, 70]} />
            <MovingStars />
          </Canvas>
        </div>
        <div className="relative z-10 p-6 text-center">
          <p className="text-lg">No story data found. Please go back and generate one.</p>
          <a
            href="/"
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-transform transform hover:scale-105"
          >
            🔙 Back to Generator
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white bg-slate-900 overflow-hidden">
      {/* 🌌 Starfield Background */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <Canvas style={{ height: "100%", width: "100%" }}>
          <fog attach="fog" args={["#0f172a", 0, 70]} />
          <MovingStars />
        </Canvas>
      </div>

      <div className="relative z-10 p-6">
        <div className="text-center mb-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-5xl font-bold text-yellow-300 bg-transparent border-none text-center w-full focus:outline-none bg-slate-800/70 backdrop-blur-sm p-4 rounded-lg"
            placeholder="Untitled Story"
          />
          <p className="text-lg text-gray-300 mt-2">✍️ Edit Your Story</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {Object.entries(story).map(([key, value]) => (
            <div
              key={key}
              className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-lg shadow-md border border-slate-600"
            >
              <h3 className="text-xl font-semibold text-yellow-300 mb-2">
                {key.replace("scene", "Scene ")}
              </h3>
              <div
                contentEditable
                suppressContentEditableWarning
                ref={(el) => (sceneRefs.current[key] = el)}
                onFocus={() => handleSceneFocus(key)}
                onBlur={(e) => handleSceneBlur(key, e)}
                onKeyDown={handleKeyDown}
                dangerouslySetInnerHTML={{ __html: value }}
                className={`w-full min-h-[6rem] p-3 border border-slate-500 rounded-md bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-200 ${
                  editingStates[key] ? 'editing' : ''
                }`}
                style={{ whiteSpace: 'pre-wrap' }}
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={handleGenerateImages}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold rounded-md shadow-lg transition-transform transform hover:scale-105"
          >
            🎬 Generate Images
          </button>
        </div>
      </div>
    </div>
  );
};

export default Textedit;