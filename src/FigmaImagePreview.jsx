import React, { useState } from "react";
import { fetchFigmaImageProxy } from "./figmaImageProxy";

export default function FigmaImagePreview() {
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fileKey = "JJr8k8Um9hr8lP68XWt6fW";
  const nodeId = "3018-1362";
  const accessToken = process.env.REACT_APP_FIGMA_TOKEN || "your-figma-token-here";

  const handleFetch = async () => {
    setLoading(true);
    setError("");
    try {
      const url = await fetchFigmaImageProxy({ fileKey, nodeId, accessToken });
      setImageUrl(url);
    } catch (err) {
      setError("Failed to fetch Figma image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Figma Image Preview</h3>
      
      <div className="space-y-4">
        <button
          onClick={handleFetch}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Fetch Figma Image"}
        </button>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        {imageUrl && (
          <div className="mt-4">
            <img
              src={imageUrl}
              alt="Figma Image"
              className="max-w-full h-auto border rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
}
