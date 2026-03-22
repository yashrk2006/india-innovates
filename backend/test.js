// const fetch = require('node-fetch'); // Using built-in fetch in Node 18+

async function test() {
    try {
        console.log("Testing /api/ai/chat...");
        const res = await fetch('http://localhost:5000/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'Hello' }]
            })
        });
        const data = await res.json();
        console.log("Response:", JSON.stringify(data, null, 2));

        if (res.ok) {
            console.log("✅ Chat test passed!");
        } else {
            console.log("❌ Chat test failed!");
        }
    } catch (err) {
        console.error("Test Error:", err.message);
    }
}

test();
