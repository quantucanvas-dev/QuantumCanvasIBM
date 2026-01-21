// pages/api/quantum/submit.js
// IBM Quantum Job Submission API Route

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { qubits, style, apiToken } = req.body;

  if (!apiToken) {
    return res.status(400).json({ error: 'IBM Quantum API token required' });
  }

  if (!qubits || qubits < 2 || qubits > 127) {
    return res.status(400).json({ error: 'Qubits must be between 2-127' });
  }

  try {
    // Create quantum circuit in OpenQASM format
    const circuit = createQuantumCircuit(qubits, style);
    
    // Submit to IBM Quantum Runtime API
    const response = await fetch('https://api.quantum-computing.ibm.com/runtime/jobs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        program_id: 'sampler',
        backend: 'ibm_brisbane',
        hub: 'ibm-q',
        group: 'open',
        project: 'main',
        params: {
          circuits: [circuit],
          shots: 1000
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit job to IBM Quantum');
    }

    return res.status(200).json({
      jobId: data.id,
      status: 'queued',
      backend: 'ibm_brisbane',
      estimatedWait: '5-30 minutes'
    });

  } catch (error) {
    console.error('IBM Quantum Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to submit quantum job' 
    });
  }
}

// Helper: Create quantum circuit in OpenQASM format
function createQuantumCircuit(qubits, style) {
  let qasm = `OPENQASM 2.0;
include "qelib1.inc";
qreg q[${qubits}];
creg c[${qubits}];
`;

  if (style === 'superposition' || !style) {
    // Apply Hadamard gates for equal superposition
    for (let i = 0; i < qubits; i++) {
      qasm += `h q[${i}];
`;
    }
  } else if (style === 'entangled') {
    // Create Bell pairs (maximum entanglement)
    for (let i = 0; i < qubits - 1; i += 2) {
      qasm += `h q[${i}];
`;
      qasm += `cx q[${i}],q[${i + 1}];
`;
    }
  } else if (style === 'interference') {
    // Quantum interference pattern
    for (let i = 0; i < qubits; i++) {
      qasm += `h q[${i}];
`;
      qasm += `rz(${i * 0.5}) q[${i}];
`;
    }
    for (let i = 0; i < qubits - 1; i++) {
      qasm += `cx q[${i}],q[${i + 1}];
`;
    }
  }

  // Measure all qubits
  for (let i = 0; i < qubits; i++) {
    qasm += `measure q[${i}] -> c[${i}];
`;
  }

  return qasm;
}
