const http = require('http');
const path = require('path');


const PORT = 3001; 
let server;
let testsPassed = 0;
let testsFailed = 0;
const testResults = [];



/**
 * Makes an HTTP request and returns the response as a promise.
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {string} urlPath - The URL path (e.g., '/api/projects')
 * @param {Object|null} data - Request body for POST requests
 * @returns {Promise<{statusCode: number, body: Object}>}
 */
function makeRequest(method, urlPath, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: urlPath,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => { body += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ statusCode: res.statusCode, body: parsed });
                } catch (e) {
                    // Response is not JSON (e.g., HTML page)
                    resolve({ statusCode: res.statusCode, body: body });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

/**
 * Asserts a condition and logs the result.
 * @param {string} testName - Name of the test
 * @param {boolean} condition - The condition to assert
 * @param {string} message - Message to display on failure
 */
function assert(testName, condition, message = '') {
    if (condition) {
        testsPassed++;
        testResults.push({ name: testName, status: 'PASS' });
        console.log(`  ✓ PASS: ${testName}`);
    } else {
        testsFailed++;
        testResults.push({ name: testName, status: 'FAIL', message });
        console.log(`  ✗ FAIL: ${testName} ${message ? '- ' + message : ''}`);
    }
}


/**
 * Test 1: Server serves the HTML page on root URL.
 */
async function testServerRoot() {
    const res = await makeRequest('GET', '/');
    assert(
        'Server responds on root URL',
        res.statusCode === 200,
        `Expected status 200, got ${res.statusCode}`
    );
}


async function testGetAllProjects() {
    const res = await makeRequest('GET', '/api/projects');
    assert(
        'GET /api/projects returns success',
        res.body.success === true,
        `Expected success=true, got ${res.body.success}`
    );
    assert(
        'GET /api/projects returns array of projects',
        Array.isArray(res.body.data) && res.body.data.length > 0,
        `Expected non-empty array, got ${JSON.stringify(res.body.data).substring(0, 100)}`
    );
}

async function testFilterProjectsByCategory() {
    const res = await makeRequest('GET', '/api/projects?category=frontend');
    assert(
        'Filter projects by category returns success',
        res.body.success === true,
        `Expected success=true`
    );
    const allFrontend = res.body.data.every((p) => p.category === 'frontend');
    assert(
        'Filtered projects are all "frontend" category',
        allFrontend,
        `Some projects are not "frontend" category`
    );
}

async function testGetSingleProject() {
    const res = await makeRequest('GET', '/api/projects/1');
    assert(
        'GET /api/projects/1 returns success',
        res.body.success === true,
        `Expected success=true`
    );
    assert(
        'Returned project has correct ID',
        res.body.data && res.body.data.id === 1,
        `Expected id=1, got ${res.body.data ? res.body.data.id : 'undefined'}`
    );
}


async function testGetNonExistentProject() {
    const res = await makeRequest('GET', '/api/projects/999');
    assert(
        'GET /api/projects/999 returns 404',
        res.statusCode === 404,
        `Expected status 404, got ${res.statusCode}`
    );
}

async function testGetAllBlogPosts() {
    const res = await makeRequest('GET', '/api/blog');
    assert(
        'GET /api/blog returns success',
        res.body.success === true,
        `Expected success=true`
    );
    assert(
        'GET /api/blog returns array of posts',
        Array.isArray(res.body.data) && res.body.data.length > 0,
        `Expected non-empty array`
    );
}


async function testGetSingleBlogPost() {
    const res = await makeRequest('GET', '/api/blog/1');
    assert(
        'GET /api/blog/1 returns success',
        res.body.success === true,
        `Expected success=true`
    );
    assert(
        'Returned blog post has correct ID',
        res.body.data && res.body.data.id === 1,
        `Expected id=1`
    );
}


async function testGetNonExistentBlogPost() {
    const res = await makeRequest('GET', '/api/blog/999');
    assert(
        'GET /api/blog/999 returns 404',
        res.statusCode === 404,
        `Expected status 404, got ${res.statusCode}`
    );
}


async function testSubmitContactValid() {
    const res = await makeRequest('POST', '/api/contact', {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'This is a test message from the automated test suite.'
    });
    assert(
        'POST /api/contact with valid data returns 201',
        res.statusCode === 201,
        `Expected status 201, got ${res.statusCode}`
    );
    assert(
        'POST /api/contact returns success message',
        res.body.success === true,
        `Expected success=true`
    );
}


async function testSubmitContactMissingFields() {
    const res = await makeRequest('POST', '/api/contact', {
        name: 'Test User'
    });
    assert(
        'POST /api/contact with missing fields returns 400',
        res.statusCode === 400,
        `Expected status 400, got ${res.statusCode}`
    );
}

async function testSubmitContactInvalidEmail() {
    const res = await makeRequest('POST', '/api/contact', {
        name: 'Test User',
        email: 'not-an-email',
        subject: 'Test',
        message: 'Test message'
    });
    assert(
        'POST /api/contact with invalid email returns 400',
        res.statusCode === 400,
        `Expected status 400, got ${res.statusCode}`
    );
}


async function testGetMessages() {
    const res = await makeRequest('GET', '/api/messages');
    assert(
        'GET /api/messages returns success',
        res.body.success === true,
        `Expected success=true`
    );
    assert(
        'GET /api/messages returns array',
        Array.isArray(res.body.data),
        `Expected array`
    );
}



async function runTests() {
    console.log('\n================================================');
    console.log('  Portfolio Web Application - API Tests');
    console.log('================================================\n');
    try {
        process.env.PORT = PORT;
        const app = require(path.join(__dirname, '..', 'server', 'server.js'));
                await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log(`  Test server running on port ${PORT}\n`);
        console.log('  Running tests...\n');

        await testServerRoot();
        await testGetAllProjects();
        await testFilterProjectsByCategory();
        await testGetSingleProject();
        await testGetNonExistentProject();
        await testGetAllBlogPosts();
        await testGetSingleBlogPost();
        await testGetNonExistentBlogPost();
        await testSubmitContactValid();
        await testSubmitContactMissingFields();
        await testSubmitContactInvalidEmail();
        await testGetMessages();

    } catch (error) {
        console.error('  Error during testing:', error.message);
    }

    console.log('\n================================================');
    console.log(`  Results: ${testsPassed} passed, ${testsFailed} failed`);
    console.log(`  Total:   ${testsPassed + testsFailed} tests`);
    console.log('================================================\n');
    process.exit(testsFailed > 0 ? 1 : 0);
}

runTests();
