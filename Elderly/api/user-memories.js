import { load_memories } from '../../services/memory_manager';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const memories = await load_memories();
      res.status(200).json(memories);
    } catch (error) {
      console.error("Error getting user memories:", error);
      res.status(500).json({ error: "Failed to load user memories" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}