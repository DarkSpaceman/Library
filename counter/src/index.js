const express = require('express');
const redis = require('redis');
const app = express();

const REDIS_URL = process.env.REDIS_URL || "redis://localhost";
const client = redis.createClient({ url: REDIS_URL });
(async () => {
    await client.connect();
})();

app.get('/counter/:bookId/incr', async ( req, res ) => {
    const { bookId } = req.params;

    try {
        const cnt = await client.incr(bookId);
        res.json({ message: `${bookId} ${cnt}` });
    } catch (err) {
        res.status(500);
        res.json('Error 500');
    }
});

const PORT = process.env.PORT | 3000;
app.listen(PORT, () => console.log(`Server listen on port ${PORT}`))