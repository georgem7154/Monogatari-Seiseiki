import React, { useEffect, useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const MyStories = () => {
  const [userId, setUserId] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStory, setActiveStory] = useState(null);

  useEffect(() => {
    fetch("/user/find/userbyemail", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((userData) => {
        const uid = userData?.userId || "george123";
        setUserId(uid);
        return fetch(`http://localhost:3000/api/getfullstory/${uid}`);
      })
      .then((res) => res.json())
      .then((data) => {
        setStories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch stories:", err);
        setLoading(false);
      });
  }, []);

  const handleCardClick = (storyId) => {
    if (!userId) return;

    fetch(`http://localhost:3000/api/getstory/${userId}/${storyId}`)
      .then((res) => res.json())
      .then((data) => {
        setActiveStory({ storyId, scenes: data });
      })
      .catch((err) => {
        console.error("❌ Failed to fetch full story:", err);
      });
  };

  const wrapText = (text, font, fontSize, maxWidth) => {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, fontSize);
      if (width < maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const handleStructuredPDFExport = async () => {
    if (!activeStory || !activeStory.scenes) return;

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    const coverPage = pdfDoc.addPage();
    const { width: pageWidth, height: pageHeight } = coverPage.getSize();

    coverPage.setFont(font);
    coverPage.setFontSize(36);
    const title = activeStory.storyId.replace(/_/g, " ").toUpperCase();
    const titleWidth = font.widthOfTextAtSize(title, 36);
    coverPage.drawText(title, {
      x: (pageWidth - titleWidth) / 2,
      y: pageHeight - 100,
      color: rgb(0.2, 0.2, 0.6),
    });

    const meta = activeStory.scenes.find(s => s.sceneKey === "meta");
    if (meta?.cover) {
      try {
        const imageBytes = Uint8Array.from(atob(meta.cover), c => c.charCodeAt(0));
        const pngImage = await pdfDoc.embedPng(imageBytes);
        const maxWidth = pageWidth - 100;
        const imgDims = pngImage.scaleToFit(maxWidth, pageHeight / 2);

        coverPage.drawImage(pngImage, {
          x: (pageWidth - imgDims.width) / 2,
          y: pageHeight / 2 - imgDims.height / 2,
          width: imgDims.width,
          height: imgDims.height,
        });
      } catch (err) {
        console.warn("⚠️ Failed to embed cover image:", err);
      }
    }

    for (const scene of activeStory.scenes.filter(s => s.sceneKey !== "meta")) {
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();

      page.setFont(font);
      page.setFontSize(20);
      page.drawText(scene.sceneKey.replace("scene", "Scene "), {
        x: 50,
        y: height - 80,
        color: rgb(0.1, 0.1, 0.4),
      });

      page.setFontSize(12);
      const wrappedText = wrapText(scene.text, font, 12, width - 100);
      let y = height - 120;
      for (const line of wrappedText) {
        if (y < 300) break;
        page.drawText(line, { x: 50, y });
        y -= 16;
      }

      if (scene.image) {
        try {
          const imageBytes = Uint8Array.from(atob(scene.image), c => c.charCodeAt(0));
          const pngImage = await pdfDoc.embedPng(imageBytes);
          const maxWidth = width - 100;
          const maxHeight = height / 2;
          const imgDims = pngImage.scaleToFit(maxWidth, maxHeight);

          page.drawImage(pngImage, {
            x: (width - imgDims.width) / 2,
            y: 100,
            width: imgDims.width,
            height: imgDims.height,
          });
        } catch (err) {
          console.warn("⚠️ Failed to embed image:", err);
        }
      }
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${activeStory.storyId}.pdf`;
    link.click();
  };

  const handleMakePublic = async () => {
  if (!activeStory || !userId) return;

  try {
    const res = await fetch(`http://localhost:3000/api/publishstory/${userId}/${activeStory.storyId}`, {
      method: "POST"
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Story published to PublicStories!");
    } else {
      console.error("❌ Failed to publish:", data.error || res.statusText);
    }
  } catch (err) {
    console.error("❌ Error publishing story:", err);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">📚 My Stories</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {stories.map((story, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(story.storyId)}
            className="cursor-pointer bg-white rounded-lg shadow-md border border-indigo-100 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {story.cover && (
              <img
                src={`data:image/png;base64,${story.cover}`}
                alt={`${story.title} cover`}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold text-indigo-700 mb-2">{story.title}</h2>
              <p className="text-sm text-gray-600">
                Genre: <strong>{story.genre}</strong><br />
                Tone: <strong>{story.tone}</strong><br />
                Audience: <strong>{story.audience}</strong>
              </p>
            </div>
          </div>
        ))}
      </div>

      {activeStory && (
        <div className="max-w-4xl mx-auto mt-16 space-y-10">
          <h2 className="text-3xl font-bold text-indigo-700 text-center mb-6">
            Full Story: {activeStory.storyId.replace(/_/g, " ").toUpperCase()}
          </h2>
          {activeStory.scenes
            .filter((scene) => scene.sceneKey !== "meta")
            .map((scene) => (
              <div
                key={scene._id}
                className="bg-white p-6 rounded-lg shadow-md border border-indigo-100"
              >
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
)} </div>
          ))}

          {/* ✅ Export & Publish Buttons */}
          <div className="text-center mt-16 space-x-4">
            <button
              onClick={handleStructuredPDFExport}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md"
            >
              📄 Download Structured PDF
            </button>
            <button
              onClick={handleMakePublic}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md"
            >
              🌍 Make Public
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyStories;
