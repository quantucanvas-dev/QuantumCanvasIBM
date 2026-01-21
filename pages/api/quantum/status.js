// pages/api/quantum/status.js
// IBM Quantum Job Status Check API Route

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { jobId, apiToken } = req.query;

  if (!jobId || !apiToken) {
    return res.status(400).json({ error: 'Missing jobId or apiToken' });
  }

  try {
    const response = await fetch(
      `https://api.quantum-computing.ibm.com/runtime/jobs/${jobId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch job status');
    }

    return res.status(200).json({
      jobId: data.id,
      status: data.state, // QUEUED, RUNNING, COMPLETED, FAILED, CANCELLED
      queuePosition: data.position || null,
      backend: data.backend || 'ibm_brisbane'
    });

  } catch (error) {
    console.error('Status Check Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to check job status' 
    });
  }
}
