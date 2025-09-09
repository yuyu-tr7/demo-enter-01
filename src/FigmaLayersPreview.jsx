import React, { useState } from "react";
import { fetchFigmaLayersProxy } from "./figmaLayersProxy";

export default function FigmaLayersPreview() {
  const [layers, setLayers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fileKey = "JJr8k8Um9hr8lP68XWt6fW";
  const nodeId = "3018-1362";
  const accessToken = process.env.REACT_APP_FIGMA_TOKEN || "your-figma-token-here";

  const handleFetch = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchFigmaLayersProxy({ fileKey, nodeId, accessToken });
      setLayers(result);
    } catch (err) {
      setError("Failed to fetch Figma layers");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Figma Layers Preview</h3>
      
      <div className="space-y-4">
        <button
          onClick={handleFetch}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Fetch Figma Layers"}
        </button>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        {layers.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Layers ({layers.length}):</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {layers.map((layer, index) => (
                <div key={index} className="p-2 bg-gray-100 rounded text-sm">
                  <div className="font-medium">{layer.name}</div>
                  <div className="text-gray-600">Type: {layer.type}</div>
                  {layer.visible !== undefined && (
                    <div className="text-gray-600">Visible: {layer.visible ? "Yes" : "No"}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
