const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'projects.json');

/**
 * Reads projects from the JSON file.
 * @returns {Array} Array of project objects
 */
function readProjects() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading projects file:', error.message);
        return [];
    }
}

/**
 * Writes projects array to the JSON file.
 * @param {Array} projects - Array of project objects to save
 */
function writeProjects(projects) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 4), 'utf-8');
    } catch (error) {
        console.error('Error writing projects file:', error.message);
        throw error;
    }
}

router.get('/', (req, res) => {
    try {
        let projects = readProjects();
        const { category } = req.query;

        // Filter by category if provided
        if (category && category !== 'all') {
            projects = projects.filter(
                (project) => project.category.toLowerCase() === category.toLowerCase()
            );
        }

        res.json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve projects'
        });
    }
});


router.get('/:id', (req, res) => {
    try {
        const projects = readProjects();
        const project = projects.find((p) => p.id === parseInt(req.params.id));

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.json({
            success: true,
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve project'
        });
    }
});


router.post('/', (req, res) => {
    try {
        const { title, description, technologies, category, image, liveUrl, githubUrl } = req.body;

        if (!title || !description || !technologies || !category) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title, description, technologies, and category'
            });
        }

        const projects = readProjects();

        const newId = projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1;

        const newProject = {
            id: newId,
            title,
            description,
            technologies: Array.isArray(technologies) ? technologies : [technologies],
            image: image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
            liveUrl: liveUrl || '#',
            githubUrl: githubUrl || '#',
            category,
            featured: false,
            date: new Date().toISOString().split('T')[0]
        };

        projects.push(newProject);
        writeProjects(projects);

        res.status(201).json({
            success: true,
            message: 'Project added successfully',
            data: newProject
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add project'
        });
    }
});

module.exports = router;
