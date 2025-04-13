const express = require('express');
const { messageStore } = require('./bot');

const router = express.Router();

router.get('/search', (req, res) => {
  const { word, limit } = req.query;

  if (!word || !limit) {
    return res.status(400).json({ error: 'word and limit are required' });
  }

  const matches = messageStore
    .filter(msg =>
      msg.content.toLowerCase().includes(word.toLowerCase()) &&
      msg.content.length >= parseInt(limit)
    )
    .map(msg => ({
      messageId: msg.id,
      content: msg.content,
      channelId: msg.channelId,
    }));

  res.json(matches);
});

module.exports = router;


