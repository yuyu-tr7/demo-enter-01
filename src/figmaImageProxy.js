// Fetch Figma node image via backend proxy
export async function fetchFigmaImageProxy({ fileKey, nodeId, accessToken }) {
  const res = await fetch('http://localhost:4000/figma/image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileKey, nodeId, accessToken }),
  });
  if (!res.ok) throw new Error('Failed to fetch Figma image from proxy');
  const data = await res.json();
  return data.imageUrl;
}
