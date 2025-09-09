// Fetch layers from Figma via backend proxy
export async function fetchFigmaLayersProxy({ fileKey, nodeId, accessToken }) {
  const res = await fetch('http://localhost:4000/figma/layers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileKey, nodeId, accessToken }),
  });
  if (!res.ok) throw new Error('Failed to fetch Figma layers from proxy');
  return await res.json();
}
