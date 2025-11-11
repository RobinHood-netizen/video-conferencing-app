export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const id = `iv-${Date.now()}`;
    const { title = 'Interview', startTime = new Date().toISOString(), duration = 30, interviewer = '', candidate = '' } = req.body || {};
    const interview = { id, title, startTime, duration, interviewer, candidate, createdAt: new Date().toISOString() };
    return res.json(interview);
  }

  if (req.method === 'GET') {
    return res.json({ message: 'Interview API endpoint' });
  }

  res.status(405).json({ error: 'Method not allowed' });
}