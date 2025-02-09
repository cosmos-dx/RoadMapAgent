import React from "react";
import ReactMarkdown from "react-markdown";

interface RoadmapProps {
  response: {
    roadmap: string;
  };
}

const MarkDownMD: React.FC<RoadmapProps> = ({ response }) => {
  return (
    <div className="p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Roadmap</h2>
      {response.roadmap ? (
        <ReactMarkdown className="prose prose-lg">{response.roadmap}</ReactMarkdown>
      ) : (
        <p className="text-gray-500">No roadmap available.</p>
      )}
    </div>
  );
};

export default MarkDownMD;
