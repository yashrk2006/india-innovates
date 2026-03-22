require('dotenv').config();
const express = require('express');
const cors = require('cors');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow frontend to call backend
app.use(express.json());

// Request Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Main Routes
app.get('/', (req, res) => {
    res.json({ message: 'Sarvam AI Proxy Backend is Live!', endpoints: ['/health', '/api/ai'] });
});

app.use('/api/ai', aiRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start Server
app.listen(PORT, async () => {
    console.log(`\n🚀 Sarvam AI Proxy Backend running at http://localhost:${PORT}`);

    // --- KEEP ALIVE MECHANISM (For Render Free Tier) ---
    // Pings the local /health endpoint every 14 minutes to prevent sleep
    if (process.env.NODE_ENV === 'production') {
        const HOST = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
        setInterval(() => {
            fetch(`${HOST}/health`)
                .then(() => console.log('💓 Keep-alive ping successful'))
                .catch((err) => console.error('💔 Keep-alive ping failed:', err.message));
        }, 14 * 60 * 1000); // 14 minutes
    }
});
