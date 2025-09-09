const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// POST /figma/layers
router.post('/layers', async (req, res) => {
  const { fileKey, nodeId, accessToken } = req.body;
  if (!fileKey || !nodeId || !accessToken) {
    return res.status(400).json({ error: 'Missing parameters' });
  }
  try {
    const url = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeId}`;
    const figmaRes = await fetch(url, {
      headers: {
        'X-Figma-Token': accessToken,
      },
    });
    if (!figmaRes.ok) throw new Error('Figma API error');
    const data = await figmaRes.json();
    const node = data.nodes[nodeId]?.document;
    if (!node || !node.children) return res.json([]);
    const layers = node.children.map(layer => ({
      id: layer.id,
      name: layer.name,
      type: layer.type,
    }));
    res.json(layers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Figma layers' });
  }
});

// POST /figma/image
router.post('/image', async (req, res) => {
  const { fileKey, nodeId, accessToken } = req.body;
  if (!fileKey || !nodeId || !accessToken) {
    return res.status(400).json({ error: 'Missing parameters' });
  }
  try {
    const url = `https://api.figma.com/v1/images/${fileKey}?ids=${nodeId}&format=png`;
    const figmaRes = await fetch(url, {
      headers: {
        'X-Figma-Token': accessToken,
      },
    });
    if (!figmaRes.ok) throw new Error('Figma API error');
    const data = await figmaRes.json();
    const imageUrl = data.images[nodeId];
    res.json({ imageUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Figma image' });
  }
});

module.exports = router;
