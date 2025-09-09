import React, { useState } from "react";
import { fetchFigmaFile } from "./figma";

export default function FigmaPreview({ fileKey, accessToken }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchFigmaFile({ fileKey, accessToken });
      setData(result);
    } catch (err) {
      setError("Failed to fetch Figma file");
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-100 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-bold mb-2">Figma File Preview</h3>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={handleFetch}
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch Figma Data"}
      </button>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {data && (
        <div className="text-sm text-gray-800">
          <div><strong>Name:</strong> {data.name}</div>
          <div><strong>Last Modified:</strong> {data.lastModified}</div>
          <div><strong>Document ID:</strong> {data.document.id}</div>
          <div><strong>Pages:</strong> {data.document.children?.map(page => page.name).join(", ")}</div>
        </div>
      )}
    </div>
  );
}
