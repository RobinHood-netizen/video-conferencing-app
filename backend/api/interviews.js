const interviews = {};

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const id = `iv-${Date.now()}`;
    const { title = 'Interview', startTime = new Date().toISOString(), duration = 30, interviewer = '', candidate = '' } = req.body;
    interviews[id] = { id, title, startTime, duration, interviewer, candidate, createdAt: new Date().toISOString() };
    return res.json(interviews[id]);
  }

  if (req.method === 'GET') {
    const { id } = req.query;
    const iv = interviews[id];
    if (!iv) return res.status(404).json({ error: 'not found' });
    return res.json(iv);
  }

  res.status(405).json({ error: 'Method not allowed' });
}