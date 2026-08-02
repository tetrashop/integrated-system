const express = require('express');
const app = express();

// لیست سرویس‌ها
const services = [
  { name: "quantum-writer", port: 3001 },
  { name: "ai-writer", port: 3002 },
  { name: "secret-garden", port: 3003 },
  { name: "3d-converter", port: 3004 },
  { name: "2d-to-3d", port: 3005 },
  { name: "content-analyzer", port: 3006 },
  { name: "anti-fragmentation", port: 3007 },
  { name: "formula-solver", port: 3008 },
  { name: "code-cleaner", port: 3009 },
  { name: "graphic-2d", port: 3010 },
  { name: "anti-smoke", port: 3011 },
  { name: "telescope-design", port: 3012 },
  { name: "teleport-system", port: 3013 },
  { name: "image-processor", port: 3014 },
  { name: "audio-converter", port: 3015 },
  { name: "video-editor", port: 3016 },
  { name: "data-encryptor", port: 3017 },
  { name: "network-scanner", port: 3018 },
  { name: "battery-optimizer", port: 3019 },
  { name: "file-organizer", port: 3020 },
  { name: "password-generator", port: 3021 },
  { name: "system-monitor", port: 3022 },
  { name: "backup-manager", port: 3023 }
];

app.get('/', (req, res) => {
  res.json({
    message: '🚀 TetraSaaS API Gateway',
    version: '1.0.0',
    services: services.length,
    endpoints: services.map(s => `/api/${s.name}`)
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: services.length
  });
});

// Route برای هر سرویس
services.forEach(service => {
  app.get(`/api/${service.name}`, (req, res) => {
    res.json({
      service: service.name,
      port: service.port,
      status: 'active',
      timestamp: new Date().toISOString()
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});
