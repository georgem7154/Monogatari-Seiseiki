import { useState } from "react";
import toast from "react-hot-toast";

function Hero() {
  const [form, setForm] = useState({
    prompt: "A detective solves crimes by entering victims' dreams.",
    genre: "mystery",
    tone: "mythic",
    audience: "young adult"
  });

  const genreOptions = [
    "sci-fi",
    "fantasy",
    "mystery",
    "historical",
    "romance",
    "horror"
  ];
  const toneOptions = [
    "dark",
    "whimsical",
    "serious",
    "satirical",
    "uplifting",
    "mythic"
  ];
  const audienceOptions = [
    "young adult",
    "children",
    "adult",
    "general",
    "educators"
  ];

  const promptIdeas = [
    "A scientist discovers a portal to a parallel universe.",
    "An ancient artifact awakens a forgotten civilization.",
    "An AI begins rewriting history through digital archives.",
    "A time traveler accidentally prevents their own birth.",
    "A haunted library reveals secrets of the cosmos.",
    "A rebellion forms in a utopia where emotions are illegal.",
    "A chef must win a cooking duel to save their hometown.",
    "A child befriends a dragon disguised as a schoolteacher.",
    "A detective solves crimes by entering victims' dreams.",
    "A spaceship crew finds Earth… but it's not the one they left."
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateRandomPrompt = () => {
    const random = promptIdeas[Math.floor(Math.random() * promptIdeas.length)];
    setForm((prev) => ({ ...prev, prompt: random }));
    toast.success("Random prompt generated!", {
      icon: "🎲",
      style: {
        background: "#1e293b",
        color: "#facc15",
        border: "1px solid #fbbf24",
        borderRadius: "8px"
      }
    });
  };

  const generateStory = () => {
    const missingField = Object.entries(form).find(
      ([key, value]) => !value.trim()
    );
    if (missingField) {
      toast.error(`Missing field: '${missingField[0]}'`, {
        icon: "⚠️",
        style: {
          borderRadius: "8px",
          background: "#fff",
          color: "#333",
          border: "1px solid #facc15"
        }
      });
      return;
    }

    localStorage.setItem("storyForm", JSON.stringify(form));
    toast.success("Redirecting to edit page...");
    setTimeout(() => {
      window.location.href = "/edittext";
    }, 1000);
  };

  return (
    <div className="min-h-screen text-black pt-20 bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">
        🧠 Story Generator
      </h1>

      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-4">
        <div className="flex gap-2">
          <textarea
            name="prompt"
            placeholder="Enter your story prompt..."
            value={form.prompt}
            onChange={handleChange}
            required
            rows={2}
            className="flex-grow px-4 py-2 border rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[3rem] max-h-[12rem] overflow-auto"
          />
          <button
            type="button"
            onClick={generateRandomPrompt}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-md"
          >
            🎲 Random
          </button>
        </div>

        <select
          name="genre"
          value={form.genre}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select Genre</option>
          {genreOptions.map((g) => (
            <option key={g} value={g}>
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </option>
          ))}
        </select>

        <select
          name="tone"
          value={form.tone}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select Tone</option>
          {toneOptions.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>

        <select
          name="audience"
          value={form.audience}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select Audience</option>
          {audienceOptions.map((a) => (
            <option key={a} value={a}>
              {a.charAt(0).toUpperCase() + a.slice(1)}
            </option>
          ))}
        </select>

        <button
          onClick={generateStory}
          className="w-full py-2 font-semibold text-white rounded-md bg-indigo-600 hover:bg-indigo-700"
        >
          Generate Story
        </button>
      </div>
    </div>
  );
}

export default Hero;