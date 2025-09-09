// Sample Figma API integration for React
// Usage: import { fetchFigmaFile } from './figma';

export async function fetchFigmaFile({ fileKey, accessToken }) {
  const url = `https://api.figma.com/v1/files/${fileKey}`;
  const res = await fetch(url, {
    headers: {
      'X-Figma-Token': accessToken,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch Figma file');
  return await res.json();
}

// Example usage in a React component:
// import { fetchFigmaFile } from './figma';
// useEffect(() => {
//   fetchFigmaFile({ fileKey: 'YOUR_FILE_KEY', accessToken: 'YOUR_ACCESS_TOKEN' })
//     .then(data => console.log(data))
//     .catch(err => console.error(err));
// }, []);
