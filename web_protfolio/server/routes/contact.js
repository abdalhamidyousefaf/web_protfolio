const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'messages.json');

/**
 * Reads contact messages from the JSON file.
 * @returns {Array} Array of message objects
 */
function readMessages() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading messages file:', error.message);
        return [];
    }
}

/**
 * Writes messages array to the JSON file.
 * @param {Array} messages - Array of message objects to save
 */
function writeMessages(messages) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 4), 'utf-8');
    } catch (error) {
        console.error('Error writing messages file:', error.message);
        throw error;
    }
}

router.post('/contact', (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, subject, and message'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        const messages = readMessages();

        const newId = messages.length > 0 ? Math.max(...messages.map((m) => m.id)) + 1 : 1;

        const newMessage = {
            id: newId,
            name,
            email,
            subject,
            message,
            date: new Date().toISOString(),
            read: false
        };

        messages.push(newMessage);
        writeMessages(messages);

        res.status(201).json({
            success: true,
            message: 'Message sent successfully! I will get back to you soon.',
            data: newMessage
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.'
        });
    }
});


router.get('/messages', (req, res) => {
    try {
        const messages = readMessages();

        messages.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve messages'
        });
    }
});

module.exports = router;
