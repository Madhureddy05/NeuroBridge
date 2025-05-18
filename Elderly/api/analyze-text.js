import { handle_analyze_text } from '../../services/memory_manager';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }
      
      const analysis = await handle_analyze_text(text);
      res.status(200).json(analysis);
    } catch (error) {
      console.error("Error analyzing text:", error);
      res.status(500).json({ error: "Failed to analyze text" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}