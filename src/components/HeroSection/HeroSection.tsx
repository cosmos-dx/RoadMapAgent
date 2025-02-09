import * as React from "react";
import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";

interface ApiResponse {
  top_diseases: [string, number][];
  top_description: string;
}

const techRoadmaps = [
  { name: "GoLang", img: "https://www.svgrepo.com/show/355038/golang.svg" },
  { name: "Flutter", img: "https://www.svgrepo.com/show/373604/flutter.svg" },
  { name: "Artificial Intelligence", img: "https://www.svgrepo.com/show/407351/robot.svg" },
  { name: "Machine Learning", img: "https://www.svgrepo.com/show/395921/brain.svg" },
  { name: "Blockchain", img: "https://www.svgrepo.com/show/380472/blockchain-digital-future-system-security.svg" },
  { name: "Rust", img: "https://www.svgrepo.com/show/374056/rust.svg" },
  { name: "Python", img: "https://www.svgrepo.com/show/452091/python.svg" },
];

const HeroSection = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [userQuery, setUserQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [selectedRoadmap, setSelectedRoadmap] = useState<"basic" | "full">("basic");

  const handleButtonClick = async (query?: string) => {
    const finalQuery = query || userQuery.trim();
    if (!finalQuery) return;

    setLoading(true);
    try {
      const res = await fetch("https://roadmapai-spwv.onrender.com/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: finalQuery, type: selectedRoadmap }),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      
      const data = await res.json();
      setResponse(data.top_description);
      setShowModal(true);
    } catch (error) {
      console.error("API Request Failed:", error);
    }
    setLoading(false);
    setUserQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleButtonClick();
    }
  };

  const downloadMarkdown = () => {
    if (!response) return;
    const blob = new Blob([response], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "roadmap.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative flex flex-col gap-3 items-center justify-center h-[90vh]" onClick={() => inputRef.current?.focus()}>
      
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500"></div>
        </div>
      )}

      <div className="mb-6 sm:mb-10">
        <p className="text-xl sm:text-5xl font-bold text-gray-800 dark:text-gray-100 text-center">
          Which Roadmap do you want?
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-[90vw] sm:w-[50vw] h-[20vh] bg-slate-800 rounded-3xl p-4">
        <div className="flex flex-col items-center justify-between h-full w-full">
          <textarea
            ref={inputRef}
            placeholder="Generate RoadMap"
            className="w-full text-xl rounded-xl shadow-sm p-2 bg-slate-800 resize-none focus:outline-none focus:ring-0 focus:border-transparent scrollbar-thin scrollbar-thumb-gray-500"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
          />

          <div className="flex flex-row items-center gap-5 w-full h-[10vh]">
            {["basic", "full"].map((type) => (
              <div
                key={type}
                className={`border-2 rounded-xl p-3 cursor-pointer transition duration-200 ${
                  selectedRoadmap === type ? "border-blue-500 bg-blue-600" : "border-gray-600 hover:border-gray-400"
                }`}
                onClick={() => setSelectedRoadmap(type as "basic" | "full")}
              >
                <div className="flex flex-row items-center gap-2">
                  <img
                    src={
                      type === "basic"
                        ? "https://www.svgrepo.com/show/475715/bond.svg"
                        : "https://www.svgrepo.com/show/475799/globe3.svg"
                    }
                    alt={`${type} Roadmap`}
                    className="w-6 h-6"
                  />
                  <p className="text-gray-300 capitalize">{type} Roadmap</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-5 w-[50vw] p-7 rounded-xl">
        {techRoadmaps.map((tech) => (
          <div
            key={tech.name}
            className="border-2 rounded-xl p-3 cursor-pointer min-w-[150px] border-gray-600 transition duration-200 hover:border-blue-400"
            onClick={() => handleButtonClick(`Give a roadmap to ${tech.name}`)}
          >
            <div className="flex flex-row items-center gap-2">
              <img src={tech.img} alt={tech.name} className="w-6 h-6" />
              <p className="text-gray-300">{tech.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Markdown Display */}
      {showModal && response && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Generated Roadmap</h2>
              <button className="text-red-500 font-bold" onClick={() => setShowModal(false)}>X</button>
            </div>
            <div className="max-h-[50vh] overflow-y-auto">
              <ReactMarkdown className="prose dark:prose-invert">{response}</ReactMarkdown>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={downloadMarkdown}
                className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
              >
                Download Markdown
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
