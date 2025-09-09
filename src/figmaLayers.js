// Fetch layers from a specific Figma node
export async function fetchFigmaLayers({ fileKey, nodeId, accessToken }) {
  const url = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeId}`;
  const res = await fetch(url, {
    headers: {
      'X-Figma-Token': accessToken,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch Figma node');
  const data = await res.json();
  // Extract layers from node document
  const node = data.nodes[nodeId]?.document;
  if (!node || !node.children) return [];
  return node.children.map(layer => ({
    id: layer.id,
    name: layer.name,
    type: layer.type,
  }));
}
