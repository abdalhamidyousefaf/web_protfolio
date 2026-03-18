const express = require('express');
const cors = require('cors');
const path = require('path');

const projectRoutes = require('./routes/projects');
const blogRoutes = require('./routes/blog');
const contactRoutes = require('./routes/contact');

const app = express();

const PORT = process.env.PORT || 3000;
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/projects', projectRoutes);

app.use('/api/blog', blogRoutes);

app.use('/api', contactRoutes);


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});


app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
});


app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`  Portfolio Server is running!`);
    console.log(`  Local:  http://localhost:${PORT}`);
    console.log(`========================================\n`);
});

module.exports = app;
