require('dotenv').config();
const express = require('express');
const cors = require('cors');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow frontend to call backend
app.use(express.json());

// Main Routes
app.use('/api/ai', aiRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start Server
app.listen(PORT, () => {
    console.log(`\n🚀 Sarvam AI Proxy Backend running at http://localhost:${PORT}`);
    console.log(`   - Chat: http://localhost:${PORT}/api/ai/chat`);
    console.log(`   - Analyze: http://localhost:${PORT}/api/ai/analyze`);
    console.log(`   - Docs: http://localhost:${PORT}/api/ai/docs`);
});
