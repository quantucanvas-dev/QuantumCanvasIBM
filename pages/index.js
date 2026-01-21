import React, { useState, useRef, useEffect } from "react";

const QuantumArtGenerator = () => {
  const canvasRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [artworkGenerated, setArtworkGenerated] = useState(false);

  // Quantum mode
  const [quantumMode, setQuantumMode] = useState("simulation"); // 'simulation' or 'ibm'
  const [ibmToken, setIbmToken] = useState("");
  const [showIbmSetup, setShowIbmSetup] = useState(false);
  
  // IBM Quantum job tracking
  const [quantumJob, setQuantumJob] = useState(null);

  // Core parameters
  const [qubits, setQubits] = useState(5);
  const [complexity, setComplexity] = useState(50);
  const [entropy, setEntropy] = useState(70);
  const [harmonics, setHarmonics] = useState(3);
  const [colorScheme, setColorScheme] = useState("cosmic");
  const [artisticStyle, setArtisticStyle] = useState("abstract");
  const [symmetry, setSymmetry] = useState("radial");
  const [layerDepth, setLayerDepth] = useState(5);

  const colorSchemes = {
    cosmic: [
      "#0f0c29",
      "#302b63",
      "#24243e",
      "#ff6b6b",
      "#4ecdc4",
      "#ffe66d",
      "#95e1d3",
    ],
    aurora: [
      "#0a0a0a",
      "#1a472a",
      "#2d5a27",
      "#5cdb95",
      "#8ee4af",
      "#edf5e1",
      "#05386b",
    ],
    nebula: [
      "#0d0221",
      "#0f084b",
      "#26408b",
      "#a6cee3",
      "#ff6b6b",
      "#c792ea",
      "#f78fb3",
    ],
    inferno: [
      "#0a0a0a",
      "#1a0000",
      "#4a0000",
      "#ff4500",
      "#ff6347",
      "#ffa500",
      "#ffd700",
    ],
    ocean: [
      "#000428",
      "#004e92",
      "#0077b6",
      "#00b4d8",
      "#90e0ef",
      "#caf0f8",
      "#48cae4",
    ],
    monochrome: [
      "#000000",
      "#1a1a1a",
      "#333333",
      "#4d4d4d",
      "#808080",
      "#b3b3b3",
      "#ffffff",
    ],
    psychedelic: [
      "#0a0a0a",
      "#ff00ff",
      "#00ffff",
      "#ff6600",
      "#00ff00",
      "#ff0066",
      "#ffff00",
    ],
    ethereal: [
      "#0d1b2a",
      "#1b263b",
      "#415a77",
      "#778da9",
      "#e0e1dd",
      "#c9ada7",
      "#9a8c98",
    ],
  };

  const artisticStyles = {
    abstract: { name: "Abstract", description: "Pure quantum patterns" },
    dali: { name: "Dalí", description: "Surrealist melting forms" },
    picasso: { name: "Picasso", description: "Cubist fragmentation" },
    kandinsky: { name: "Kandinsky", description: "Geometric abstraction" },
    pollock: { name: "Pollock", description: "Action painting chaos" },
    mondrian: { name: "Mondrian", description: "De Stijl grid" },
    vangogh: { name: "Van Gogh", description: "Swirling expressionism" },
    escher: { name: "Escher", description: "Impossible geometry" },
  };

  // Poll for quantum job status
  useEffect(() => {
    if (!quantumJob || quantumJob.status === 'COMPLETED' || quantumJob.status === 'FAILED') {
      return;
    }

    const pollInterval = setInterval(async () => {
      try {
        const statusRes = await fetch(
          `./api/quantum/status?jobId=${quantumJob.jobId}&apiToken=${ibmToken}`
        );
        const statusData = await statusRes.json();

        setQuantumJob(prev => ({
          ...prev,
          status: statusData.status,
          queuePosition: statusData.queuePosition
        }));

        if (statusData.status === 'COMPLETED') {
          clearInterval(pollInterval);
          await fetchQuantumResults(quantumJob.jobId);
        }

        if (statusData.status === 'FAILED') {
          clearInterval(pollInterval);
          alert('Quantum job failed. Please try again.');
          setIsGenerating(false);
        }

      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [quantumJob, ibmToken]);

  // Quantum simulation functions
  const quantumRandom = (seed) => {
    let x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };

  const simulateQuantumState = (numQubits, seed) => {
    const states = Math.pow(2, numQubits);
    const amplitudes = [];
    let totalProb = 0;

    for (let i = 0; i < states; i++) {
      const real = quantumRandom(seed + i * 0.1) * 2 - 1;
      const imag = quantumRandom(seed + i * 0.1 + 1000) * 2 - 1;
      const prob = real * real + imag * imag;
      amplitudes.push({ real, imag, prob, phase: Math.atan2(imag, real) });
      totalProb += prob;
    }

    // Normalize
    amplitudes.forEach((a) => (a.prob /= totalProb));
    return amplitudes;
  };

  const applyQuantumGates = (amplitudes, gateType, entropyLevel) => {
    return amplitudes.map((a, i) => {
      const hadamardFactor = Math.cos(Math.PI / 4 + entropyLevel * 0.01);
      const phaseFactor = Math.sin(a.phase * (1 + entropyLevel * 0.02));
      return {
        ...a,
        real: a.real * hadamardFactor - a.imag * phaseFactor,
        imag: a.real * phaseFactor + a.imag * hadamardFactor,
        phase: a.phase + entropyLevel * 0.05 * quantumRandom(i),
      };
    });
  };

  // Artistic style rendering functions
  const renderAbstract = (ctx, x, y, size, color, phase, amplitude) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(phase);

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, color + "80");
    gradient.addColorStop(1, "transparent");

    ctx.fillStyle = gradient;
    ctx.beginPath();

    const points = Math.floor(3 + amplitude * 8);
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const r = size * (0.5 + 0.5 * Math.sin(angle * harmonics + phase));
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const renderDali = (ctx, x, y, size, color, phase, amplitude) => {
    ctx.save();
    ctx.translate(x, y);

    const meltFactor = Math.sin(phase * 2) * 0.5;
    ctx.transform(
      1,
      meltFactor,
      meltFactor * 0.5,
      1 + Math.abs(meltFactor),
      0,
      0
    );

    const gradient = ctx.createLinearGradient(-size, -size, size, size);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, color + "aa");
    gradient.addColorStop(1, color + "33");

    ctx.fillStyle = gradient;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    ctx.beginPath();
    for (let i = 0; i <= 50; i++) {
      const angle = (i / 50) * Math.PI * 2;
      const wobble = Math.sin(angle * 3 + phase * 5) * size * 0.3;
      const drip =
        Math.max(0, Math.sin(angle - Math.PI / 2)) * size * meltFactor * 2;
      const r = size * 0.6 + wobble;
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r + drip;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.globalAlpha = 0.6;
    for (let i = 0; i < 3; i++) {
      const ox = Math.cos(phase + i * 2) * size * 0.8;
      const oy = Math.sin(phase * 0.5 + i) * size * 0.5 - size * 0.3;
      ctx.beginPath();
      ctx.ellipse(ox, oy, size * 0.15, size * 0.1, phase + i, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  const renderPicasso = (ctx, x, y, size, color, phase, amplitude) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(phase * 0.3);

    const colors = colorSchemes[colorScheme];

    const fragments = 5 + Math.floor(amplitude * 5);
    for (let i = 0; i < fragments; i++) {
      const angle = (i / fragments) * Math.PI * 2 + phase;
      const nextAngle = ((i + 1) / fragments) * Math.PI * 2 + phase;
      const innerR = size * (0.2 + quantumRandom(i + phase * 10) * 0.3);
      const outerR = size * (0.5 + quantumRandom(i + phase * 20) * 0.5);

      ctx.fillStyle =
        colors[(i + Math.floor(phase * 10)) % colors.length] + "cc";
      ctx.strokeStyle = colors[0];
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * outerR, Math.sin(angle) * outerR);
      ctx.lineTo(
        Math.cos((angle + nextAngle) / 2) * innerR * 1.5,
        Math.sin((angle + nextAngle) / 2) * innerR * 1.5
      );
      ctx.lineTo(Math.cos(nextAngle) * outerR, Math.sin(nextAngle) * outerR);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.globalAlpha = 0.8;
    ctx.fillStyle = colors[3] || color;
    ctx.beginPath();
    ctx.arc(size * 0.2, -size * 0.1, size * 0.15, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const renderKandinsky = (ctx, x, y, size, color, phase, amplitude) => {
    ctx.save();
    ctx.translate(x, y);

    const colors = colorSchemes[colorScheme];

    ctx.globalAlpha = 0.7;

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = colors[4] || "#ffffff";
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      const angle = phase + (i / 4) * Math.PI;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * size * 1.2, Math.sin(angle) * size * 1.2);
      ctx.lineTo(
        Math.cos(angle + Math.PI) * size * 1.2,
        Math.sin(angle + Math.PI) * size * 1.2
      );
      ctx.stroke();
    }

    for (let i = 0; i < 3; i++) {
      const ox = Math.cos(phase * 2 + i * 2.5) * size * 0.5;
      const oy = Math.sin(phase * 2 + i * 2.5) * size * 0.5;
      const shapeSize = size * (0.1 + amplitude * 0.2);

      ctx.fillStyle = colors[(i + 2) % colors.length];
      ctx.beginPath();

      if (i % 3 === 0) {
        ctx.moveTo(ox, oy - shapeSize);
        ctx.lineTo(ox - shapeSize, oy + shapeSize);
        ctx.lineTo(ox + shapeSize, oy + shapeSize);
      } else if (i % 3 === 1) {
        ctx.rect(ox - shapeSize / 2, oy - shapeSize / 2, shapeSize, shapeSize);
      } else {
        ctx.arc(ox, oy, shapeSize / 2, 0, Math.PI * 2);
      }
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  };

  const renderPollock = (ctx, x, y, size, color, phase, amplitude) => {
    ctx.save();

    const colors = colorSchemes[colorScheme];

    ctx.lineWidth = 1 + amplitude * 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);

    let cx = x,
      cy = y;
    const steps = 20 + Math.floor(complexity * 0.3);
    for (let i = 0; i < steps; i++) {
      const dx = (quantumRandom(phase + i * 0.1) - 0.5) * size * 0.8;
      const dy = (quantumRandom(phase + i * 0.2 + 100) - 0.5) * size * 0.8;
      cx += dx;
      cy += dy;
      ctx.lineTo(cx, cy);
    }
    ctx.stroke();

    for (let i = 0; i < 8; i++) {
      const sx = x + (quantumRandom(phase + i * 0.3) - 0.5) * size * 2;
      const sy = y + (quantumRandom(phase + i * 0.4 + 50) - 0.5) * size * 2;
      const splatterSize = size * 0.05 * (1 + quantumRandom(phase + i));

      ctx.fillStyle = colors[(i + Math.floor(phase * 5)) % colors.length];
      ctx.beginPath();
      ctx.arc(sx, sy, splatterSize, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  const renderMondrian = (ctx, x, y, size, color, phase, amplitude) => {
    ctx.save();
    ctx.translate(x - size / 2, y - size / 2);

    const mondrianColors = [
      "#ffffff",
      "#ff0000",
      "#0000ff",
      "#ffff00",
      "#ffffff",
      "#ffffff",
    ];

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 4;

    const divisions = 3 + Math.floor(amplitude * 3);
    const cellSize = size / divisions;

    for (let i = 0; i < divisions; i++) {
      for (let j = 0; j < divisions; j++) {
        const cellX = i * cellSize;
        const cellY = j * cellSize;
        const colorIndex = Math.floor(
          quantumRandom(phase + i * 10 + j) * mondrianColors.length
        );

        ctx.fillStyle = mondrianColors[colorIndex];
        ctx.fillRect(cellX, cellY, cellSize, cellSize);
        ctx.strokeRect(cellX, cellY, cellSize, cellSize);
      }
    }

    ctx.restore();
  };

  const renderVanGogh = (ctx, x, y, size, color, phase, amplitude) => {
    ctx.save();
    ctx.translate(x, y);

    const colors = colorSchemes[colorScheme];

    ctx.lineWidth = 3 + amplitude * 4;
    ctx.lineCap = "round";

    const swirls = 5 + Math.floor(harmonics * 2);
    for (let s = 0; s < swirls; s++) {
      const startAngle = (s / swirls) * Math.PI * 2 + phase;
      const swirlColor = colors[(s + Math.floor(phase * 3)) % colors.length];

      ctx.strokeStyle = swirlColor;
      ctx.beginPath();

      let r = size * 0.1;
      for (let i = 0; i < 50; i++) {
        const angle = startAngle + i * 0.15;
        r += size * 0.015;
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    ctx.fillStyle = colors[5] || "#ffe66d";
    for (let i = 0; i < 5; i++) {
      const sx = Math.cos(phase + i * 1.5) * size * 0.7;
      const sy = Math.sin(phase * 0.7 + i * 1.5) * size * 0.7;

      ctx.beginPath();
      for (let j = 0; j < 8; j++) {
        const angle = (j / 8) * Math.PI * 2;
        const starR = j % 2 === 0 ? size * 0.08 : size * 0.03;
        const px = sx + Math.cos(angle) * starR;
        const py = sy + Math.sin(angle) * starR;
        j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  };

  const renderEscher = (ctx, x, y, size, color, phase, amplitude) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(phase * 0.5);

    const colors = colorSchemes[colorScheme];

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    const layers = 4;
    for (let l = 0; l < layers; l++) {
      const layerSize = size * (1 - l * 0.2);
      const rotation = phase + (l * Math.PI) / 6;

      ctx.save();
      ctx.rotate(rotation);

      ctx.fillStyle =
        colors[(l + Math.floor(phase * 5)) % colors.length] + "80";

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const px = Math.cos(angle) * layerSize * 0.5;
        const py = Math.sin(angle) * layerSize * 0.5;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      if (l === 0) {
        ctx.strokeStyle = colors[4] || "#ffffff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        const triSize = layerSize * 0.3;
        ctx.moveTo(0, -triSize);
        ctx.lineTo(triSize * 0.866, triSize * 0.5);
        ctx.lineTo(-triSize * 0.866, triSize * 0.5);
        ctx.closePath();
        ctx.stroke();
      }

      ctx.restore();
    }

    ctx.restore();
  };

  const renderByStyle = (ctx, style, x, y, size, color, phase, amplitude) => {
    switch (style) {
      case "dali":
        renderDali(ctx, x, y, size, color, phase, amplitude);
        break;
      case "picasso":
        renderPicasso(ctx, x, y, size, color, phase, amplitude);
        break;
      case "kandinsky":
        renderKandinsky(ctx, x, y, size, color, phase, amplitude);
        break;
      case "pollock":
        renderPollock(ctx, x, y, size, color, phase, amplitude);
        break;
      case "mondrian":
        renderMondrian(ctx, x, y, size, color, phase, amplitude);
        break;
      case "vangogh":
        renderVanGogh(ctx, x, y, size, color, phase, amplitude);
        break;
      case "escher":
        renderEscher(ctx, x, y, size, color, phase, amplitude);
        break;
      default:
        renderAbstract(ctx, x, y, size, color, phase, amplitude);
    }
  };

  const applySymmetry = (ctx, width, height, renderFunc) => {
    switch (symmetry) {
      case "radial":
        for (let i = 0; i < 4; i++) {
          ctx.save();
          ctx.translate(width / 2, height / 2);
          ctx.rotate((i / 4) * Math.PI * 2);
          ctx.translate(-width / 2, -height / 2);
          renderFunc();
          ctx.restore();
        }
        break;
      case "bilateral":
        renderFunc();
        ctx.save();
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        renderFunc();
        ctx.restore();
        break;
      case "kaleidoscope":
        for (let i = 0; i < 8; i++) {
          ctx.save();
          ctx.translate(width / 2, height / 2);
          ctx.rotate((i / 8) * Math.PI * 2);
          if (i % 2 === 1) ctx.scale(1, -1);
          ctx.translate(-width / 2, -height / 2);
          renderFunc();
          ctx.restore();
        }
        break;
      default:
        renderFunc();
    }
  };

  // Fetch quantum results when job completes
  const fetchQuantumResults = async (jobId) => {
    try {
      const resultsRes = await fetch(
        `./api/quantum/results?jobId=${jobId}&apiToken=${ibmToken}`
      );
      const resultsData = await resultsRes.json();

      if (!resultsRes.ok) {
        throw new Error(resultsData.error);
      }

      // Convert IBM Quantum results to our quantum state format
      const measurements = resultsData.measurements || [];
      const quantumStates = convertMeasurementsToStates(measurements);
      
      // Use the quantum data to generate art
      generateArtFromQuantumStates(quantumStates);

    } catch (error) {
      alert(`Error fetching results: ${error.message}`);
      setIsGenerating(false);
    }
  };

  // Convert measurements to quantum states for rendering
  const convertMeasurementsToStates = (measurements) => {
    const states = Math.pow(2, qubits);
    const amplitudes = [];
    const counts = {};
    
    // Count occurrences of each measurement
    measurements.forEach(bitstring => {
      counts[bitstring] = (counts[bitstring] || 0) + 1;
    });
    
    // Convert to probability distribution
    const total = measurements.length;
    for (let i = 0; i < states; i++) {
      const bitstring = i.toString(2).padStart(qubits, '0');
      const count = counts[bitstring] || 0;
      const prob = count / total;
      const phase = Math.random() * Math.PI * 2; // Phase info lost in measurement
      
      amplitudes.push({
        real: Math.sqrt(prob) * Math.cos(phase),
        imag: Math.sqrt(prob) * Math.sin(phase),
        prob,
        phase
      });
    }
    
    return amplitudes;
  };

  const generateArtFromQuantumStates = (quantumStates) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Clear and set background
    const colors = colorSchemes[colorScheme];
    const bgGradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      width * 0.7
    );
    bgGradient.addColorStop(0, colors[1] || colors[0]);
    bgGradient.addColorStop(1, colors[0]);
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Add texture/grain
    ctx.globalAlpha = 0.03;
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.fillStyle = Math.random() > 0.5 ? "#ffffff" : "#000000";
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.globalAlpha = 1;

    // Render layers
    const renderLayer = () => {
      for (let layer = 0; layer < layerDepth; layer++) {
        ctx.globalAlpha = 0.3 + (layer / layerDepth) * 0.5;

        const elementsPerLayer = Math.floor(5 + complexity * 0.2);
        const seed = Date.now() * Math.random();

        for (let i = 0; i < elementsPerLayer; i++) {
          const stateIndex = (i + layer * 10) % quantumStates.length;
          const state = quantumStates[stateIndex];

          const x =
            width * 0.1 + quantumRandom(seed + i * 0.1 + layer) * width * 0.8;
          const y =
            height * 0.1 +
            quantumRandom(seed + i * 0.2 + layer + 100) * height * 0.8;
          const size = 30 + state.prob * complexity * 3 + layer * 10;
          const color = colors[2 + (i % (colors.length - 2))];

          renderByStyle(
            ctx,
            artisticStyle,
            x,
            y,
            size,
            color,
            state.phase,
            state.prob
          );
        }
      }
    };

    // Apply symmetry and render
    if (symmetry !== "none") {
      applySymmetry(ctx, width, height, renderLayer);
    } else {
      renderLayer();
    }

    // Add glow effect
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.1;
    const glowGradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      width * 0.5
    );
    glowGradient.addColorStop(0, colors[3] || colors[2]);
    glowGradient.addColorStop(1, "transparent");
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;

    // Add signature
    ctx.font = '12px "Courier New", monospace';
    ctx.fillStyle = colors[5] || "#ffffff";
    ctx.globalAlpha = 0.5;
    const modeLabel = quantumMode === "ibm" ? "IBM-Q" : "SIM";
    ctx.fillText(
      `Q${qubits} | ${artisticStyle.toUpperCase()} | ${modeLabel} | ${
        new Date().toISOString().split("T")[0]
      }`,
      10,
      height - 10
    );
    ctx.globalAlpha = 1;

    setIsGenerating(false);
    setArtworkGenerated(true);
  };

  const generateArt = async () => {
    setIsGenerating(true);

    // Check if using IBM Quantum
    if (quantumMode === "ibm" && ibmToken) {
      try {
        // Submit job to IBM Quantum
        const submitRes = await fetch('./api/quantum/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            qubits,
            style: 'entangled',
            apiToken: ibmToken
          })
        });

        const submitData = await submitRes.json();

        if (!submitRes.ok) {
          throw new Error(submitData.error);
        }

        setQuantumJob({
          jobId: submitData.jobId,
          status: 'QUEUED',
          backend: submitData.backend
        });

        // Don't set isGenerating to false - polling will handle it
        return;

      } catch (error) {
        console.error('IBM Quantum error:', error);
        alert(`IBM Quantum Error: ${error.message}. Falling back to simulation.`);
        // Fall through to simulation
      }
    }

    // Simulation mode (or fallback)
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const colors = colorSchemes[colorScheme];
    const bgGradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      width * 0.7
    );
    bgGradient.addColorStop(0, colors[1] || colors[0]);
    bgGradient.addColorStop(1, colors[0]);
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 0.03;
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.fillStyle = Math.random() > 0.5 ? "#ffffff" : "#000000";
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.globalAlpha = 1;

    let quantumStates;
    const seed = Date.now() * Math.random();

    quantumStates = simulateQuantumState(qubits, seed);
    quantumStates = applyQuantumGates(quantumStates, "hadamard", entropy);

    const renderLayer = () => {
      for (let layer = 0; layer < layerDepth; layer++) {
        ctx.globalAlpha = 0.3 + (layer / layerDepth) * 0.5;

        const elementsPerLayer = Math.floor(5 + complexity * 0.2);

        for (let i = 0; i < elementsPerLayer; i++) {
          const stateIndex = (i + layer * 10) % quantumStates.length;
          const state = quantumStates[stateIndex];

          const x =
            width * 0.1 + quantumRandom(seed + i * 0.1 + layer) * width * 0.8;
          const y =
            height * 0.1 +
            quantumRandom(seed + i * 0.2 + layer + 100) * height * 0.8;
          const size = 30 + state.prob * complexity * 3 + layer * 10;
          const color = colors[2 + (i % (colors.length - 2))];

          renderByStyle(
            ctx,
            artisticStyle,
            x,
            y,
            size,
            color,
            state.phase,
            state.prob
          );
        }
      }
    };

    if (symmetry !== "none") {
      applySymmetry(ctx, width, height, renderLayer);
    } else {
      renderLayer();
    }

    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.1;
    const glowGradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      width * 0.5
    );
    glowGradient.addColorStop(0, colors[3] || colors[2]);
    glowGradient.addColorStop(1, "transparent");
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;

    ctx.font = '12px "Courier New", monospace';
    ctx.fillStyle = colors[5] || "#ffffff";
    ctx.globalAlpha = 0.5;
    const modeLabel = quantumMode === "ibm" ? "IBM-Q" : "SIM";
    ctx.fillText(
      `Q${qubits} | ${artisticStyle.toUpperCase()} | ${modeLabel} | ${
        new Date().toISOString().split("T")[0]
      }`,
      10,
      height - 10
    );
    ctx.globalAlpha = 1;

    setIsGenerating(false);
    setArtworkGenerated(true);
  };

  const downloadArt = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `quantum-art-${artisticStyle}-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Slider component
  const Slider = ({ label, value, onChange, min, max, icon }) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
          <span>{icon}</span>
          {label}
        </label>
        <span className="text-sm font-mono text-cyan-400">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer slider-thumb"
        style={{
          background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${
            ((value - min) / (max - min)) * 100
          }%, #1f2937 ${((value - min) / (max - min)) * 100}%, #1f2937 100%)`,
        }}
      />
    </div>
  );

  return (
    <div
      className="min-h-screen bg-black text-white overflow-hidden"
      style={{ fontFamily: "'Space Mono', 'Courier New', monospace" }}
    >
      {/* Animated background */}
      <div className="fixed inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, #06b6d4 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%),
                           radial-gradient(circle at 50% 50%, #ec4899 0%, transparent 50%)`,
            filter: "blur(100px)",
          }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="fixed inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 mb-6">
            <div
              className={`w-2 h-2 rounded-full ${
                quantumMode === "ibm" ? "bg-amber-400" : "bg-cyan-400"
              } animate-pulse`}
            />
            <span className="text-xs uppercase tracking-widest text-cyan-400">
              {quantumMode === "ibm"
                ? "IBM Quantum Mode"
                : "Quantum Simulation Active"}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            QUANTUM CANVAS
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Transform quantum probability distributions into stunning visual
            art. Each creation is uniquely generated from quantum states.
          </p>
        </header>

        {/* Quantum Mode Selector */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-2 border border-gray-800 flex gap-2">
            <button
              onClick={() => setQuantumMode("simulation")}
              className={`flex-1 py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 ${
                quantumMode === "simulation"
                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50"
                  : "hover:bg-gray-800/50"
              }`}
            >
              <div className="text-2xl">🖥️</div>
              <div className="text-left">
                <div className="font-bold text-sm">Simulation Mode</div>
                <div className="text-xs text-gray-500">Instant • Unlimited</div>
              </div>
              {quantumMode === "simulation" && (
                <div className="ml-auto w-3 h-3 rounded-full bg-cyan-400" />
              )}
            </button>

            <button
              onClick={() => {
                setQuantumMode("ibm");
                setShowIbmSetup(true);
              }}
              className={`flex-1 py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 relative ${
                quantumMode === "ibm"
                  ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50"
                  : "hover:bg-gray-800/50"
              }`}
            >
              <div className="text-2xl">⚛️</div>
              <div className="text-left">
                <div className="font-bold text-sm flex items-center gap-2">
                  IBM Quantum
                </div>
                <div className="text-xs text-gray-500">
                  Real Hardware • Queue Time
                </div>
              </div>
              {quantumMode === "ibm" && (
                <div className="ml-auto w-3 h-3 rounded-full bg-amber-400" />
              )}
            </button>
          </div>

          {/* IBM Quantum Setup Panel */}
          {quantumMode === "ibm" && (
            <div className="mt-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-2xl">
                  🔒
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1 flex items-center gap-2">
                    IBM Quantum Integration
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">
                    Connect to real IBM Quantum hardware. Get your free API token at quantum.ibm.com
                  </p>

                  <div className="relative">
                    <input
                      type="password"
                      value={ibmToken}
                      onChange={(e) => setIbmToken(e.target.value)}
                      placeholder="Enter your IBM Quantum API token..."
                      className="w-full bg-black/40 border border-gray-600/50 rounded-xl py-3 px-4 text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                    />
                    {ibmToken && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-sm">
                        ✓
                      </div>
                    )}
                  </div>
                  
                  <small className="text-xs text-gray-500 mt-2 block">
                    Get your free token at{' '}
                    <a 
                      href="https://quantum.ibm.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline"
                    >
                      quantum.ibm.com
                    </a>
                  </small>
                </div>
              </div>

              {/* IBM Quantum Job Status */}
              {quantumJob && (
                <div className="mt-4 bg-black/20 rounded-lg p-4">
                  <h4 className="font-bold text-sm mb-2">Quantum Job Status</h4>
                  <div className="space-y-1 text-xs text-gray-400">
                    <p>Job ID: <span className="text-gray-300 font-mono">{quantumJob.jobId}</span></p>
                    <p>Backend: <span className="text-gray-300">{quantumJob.backend}</span></p>
                    <p>Status: <span className={
                      quantumJob.status === 'COMPLETED' ? 'text-green-400' :
                      quantumJob.status === 'RUNNING' ? 'text-blue-400' :
                      quantumJob.status === 'FAILED' ? 'text-red-400' :
                      'text-yellow-400'
                    }>{quantumJob.status}</span></p>
                    {quantumJob.queuePosition && (
                      <p>Queue Position: <span className="text-gray-300">{quantumJob.queuePosition}</span></p>
                    )}
                  </div>
                  {quantumJob.status === 'QUEUED' && (
                    <p className="text-xs text-yellow-400 mt-2">⏱️ Typical wait: 5-30 minutes</p>
                  )}
                  {quantumJob.status === 'RUNNING' && (
                    <p className="text-xs text-blue-400 mt-2">⚡ Running on quantum computer...</p>
                  )}
                </div>
              )}

              {/* IBM Quantum Info */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-black/20 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-gray-400">127</div>
                  <div className="text-xs text-gray-500">Qubits Available</div>
                </div>
                <div className="bg-black/20 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-gray-400">5-30m</div>
                  <div className="text-xs text-gray-500">Queue Time</div>
                </div>
                <div className="bg-black/20 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-gray-400">Real</div>
                  <div className="text-xs text-gray-500">Quantum Noise</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Canvas Section */}
          <div className="order-2 lg:order-1">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl opacity-30 blur-xl group-hover:opacity-50 transition-opacity" />

              {/* Canvas container */}
              <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl p-4 border border-gray-800">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={600}
                  className="w-full rounded-lg"
                  style={{ background: "#0a0a0a" }}
                />

                {/* Overlay when not generated */}
                {!artworkGenerated && !isGenerating && (
                  <div className="absolute inset-4 flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="text-6xl mb-4">◈</div>
                      <p className="text-gray-400">
                        Configure parameters and generate
                      </p>
                    </div>
                  </div>
                )}

                {/* Loading overlay */}
                {isGenerating && (
                  <div className="absolute inset-4 flex items-center justify-center rounded-lg bg-black/80 backdrop-blur-sm">
                    <div className="text-center">
                      <div
                        className={`w-16 h-16 border-4 ${
                          quantumMode === "ibm"
                            ? "border-amber-500/30 border-t-amber-500"
                            : "border-cyan-500/30 border-t-cyan-500"
                        } rounded-full animate-spin mx-auto mb-4`}
                      />
                      <p
                        className={
                          quantumMode === "ibm"
                            ? "text-amber-400"
                            : "text-cyan-400"
                        }
                      >
                        {quantumMode === "ibm"
                          ? "Running on IBM Quantum hardware..."
                          : "Collapsing quantum states..."}
                      </p>
                      {quantumMode === "ibm" && (
                        <p className="text-xs text-gray-500 mt-2">
                          This may take a few minutes
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={generateArt}
                disabled={isGenerating || (quantumMode === "ibm" && !ibmToken)}
                className={`flex-1 py-4 px-6 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
                  quantumMode === "ibm" && ibmToken
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400"
                    : "bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 shadow-cyan-500/25 hover:shadow-cyan-500/40"
                }`}
              >
                {isGenerating
                  ? "Generating..."
                  : quantumMode === "ibm" && !ibmToken
                  ? "🔒 Enter API Token"
                  : quantumMode === "ibm"
                  ? "⚛️ Run on IBM Quantum"
                  : "◈ Generate Art"}
              </button>

              {artworkGenerated && (
                <button
                  onClick={downloadArt}
                  className="py-4 px-6 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600"
                >
                  ↓ Save
                </button>
              )}
            </div>
          </div>

          {/* Controls Section */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Artistic Style */}
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
              <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                <span>🎨</span> Artistic Style
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(artisticStyles).map(
                  ([key, { name, description }]) => (
                    <button
                      key={key}
                      onClick={() => setArtisticStyle(key)}
                      className={`p-3 rounded-xl text-left transition-all duration-200 ${
                        artisticStyle === key
                          ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/50 border"
                          : "bg-gray-800/50 border border-gray-700/50 hover:border-gray-600"
                      }`}
                    >
                      <div className="font-bold text-sm">{name}</div>
                      <div className="text-xs text-gray-500">{description}</div>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Color Scheme */}
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
              <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                <span>🌈</span> Color Palette
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(colorSchemes).map(([key, colors]) => (
                  <button
                    key={key}
                    onClick={() => setColorScheme(key)}
                    className={`p-2 rounded-xl transition-all duration-200 ${
                      colorScheme === key
                        ? "ring-2 ring-cyan-500 ring-offset-2 ring-offset-gray-900"
                        : "hover:scale-105"
                    }`}
                  >
                    <div className="h-8 rounded-lg flex overflow-hidden">
                      {colors.slice(0, 4).map((color, i) => (
                        <div
                          key={i}
                          className="flex-1"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-center mt-1 capitalize text-gray-400">
                      {key}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Symmetry */}
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
              <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                <span>◇</span> Symmetry Mode
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {["none", "bilateral", "radial", "kaleidoscope"].map((sym) => (
                  <button
                    key={sym}
                    onClick={() => setSymmetry(sym)}
                    className={`py-2 px-3 rounded-lg text-xs uppercase transition-all duration-200 ${
                      symmetry === sym
                        ? "bg-cyan-500/20 border-cyan-500/50 border text-cyan-400"
                        : "bg-gray-800/50 border border-gray-700/50 hover:border-gray-600 text-gray-400"
                    }`}
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantum Parameters */}
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
              <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                <span>⚛</span> Quantum Parameters
              </h3>

              <Slider
                label="Qubits"
                value={qubits}
                onChange={setQubits}
                min={2}
                max={8}
                icon="◉"
              />

              <Slider
                label="Complexity"
                value={complexity}
                onChange={setComplexity}
                min={10}
                max={100}
                icon="◆"
              />

              <Slider
                label="Entropy"
                value={entropy}
                onChange={setEntropy}
                min={0}
                max={100}
                icon="◈"
              />

              <Slider
                label="Harmonics"
                value={harmonics}
                onChange={setHarmonics}
                min={1}
                max={8}
                icon="∿"
              />

              <Slider
                label="Layer Depth"
                value={layerDepth}
                onChange={setLayerDepth}
                min={1}
                max={10}
                icon="▣"
              />
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-6 border border-cyan-500/20">
              <div className="flex items-start gap-4">
                <div className="text-2xl">💡</div>
                <div>
                  <h4 className="font-bold text-sm mb-1">How it works</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Quantum states are {quantumMode === "ibm" ? "measured on real IBM quantum hardware" : "simulated using superposition principles"}.
                    Each measurement collapses the wave function, creating
                    unique probability distributions that drive the artistic
                    generation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-600 text-sm">
          <p>
            Quantum Canvas v2.0 •{" "}
            {quantumMode === "ibm" ? "IBM Quantum Mode" : "Simulation Mode"}
          </p>
          <p className="text-xs text-gray-700 mt-1">
            Powered by quantum probability distributions
          </p>
        </footer>
      </div>

      {/* Custom styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #06b6d4, #8b5cf6);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #06b6d4, #8b5cf6);
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
        }
      `}</style>
    </div>
  );
};

export default QuantumArtGenerator;
