import { extract_facts } from '../../services/memory_manager';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }
      
      const updatedMemories = await extract_facts(text);
      res.status(200).json(updatedMemories);
    } catch (error) {
      console.error("Error extracting facts:", error);
      res.status(500).json({ error: "Failed to extract facts from text" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}