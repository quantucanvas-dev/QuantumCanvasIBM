// pages/api/quantum/results.js
// IBM Quantum Job Results Fetch API Route

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
      `https://api.quantum-computing.ibm.com/runtime/jobs/${jobId}/results`,
      {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch results');
    }

    // Extract measurement data from IBM Quantum result format
    const counts = data.quasi_dists?.[0] || data.results?.quasi_dists?.[0] || {};
    
    // Convert probability distribution to measurement array
    const measurements = [];
    const probabilities = {};
    
    for (const [bitstring, probability] of Object.entries(counts)) {
      probabilities[bitstring] = probability;
      const count = Math.round(probability * 1000);
      for (let i = 0; i < count; i++) {
        measurements.push(bitstring);
      }
    }

    // Determine number of qubits from bitstring length
    const qubits = Object.keys(counts)[0]?.length || 8;

    return res.status(200).json({
      jobId: data.job_id || jobId,
      backend: data.backend || 'ibm_brisbane',
      timestamp: data.created || new Date().toISOString(),
      measurements,
      probabilities,
      qubits,
      shots: 1000
    });

  } catch (error) {
    console.error('Results Fetch Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to fetch quantum results' 
    });
  }
}
