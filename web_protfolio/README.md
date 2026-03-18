# Personal Portfolio & Blog Web Application

A fully functional personal portfolio and blog web application built with **HTML**, **CSS**, **JavaScript** on the front-end and **Node.js** with **Express.js** on the back-end. The application features a responsive design, dynamic content loaded from the server, and a contact form that stores messages on the backend.

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Design Choices](#design-choices)
- [Screenshots](#screenshots)
- [Testing](#testing)
- [License](#license)

---

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices using CSS media queries, Flexbox, and CSS Grid.
- **Dynamic Projects Section**: Project data is fetched from the backend API (`GET /api/projects`) and rendered dynamically with JavaScript. Supports category filtering.
- **Dynamic Blog Section**: Blog posts are fetched from the backend API (`GET /api/blog`) and displayed as cards. Clicking a post opens a modal with the full content fetched via `GET /api/blog/:id`.
- **Contact Form**: Users can submit messages through a contact form. Data is validated on the client-side and sent to the backend (`POST /api/contact`), where it is stored in a JSON file.
- **Typewriter Animation**: The hero section features a typewriter text animation cycling through different titles.
- **Animated Statistics**: Stat counters animate when scrolled into view.
- **Skill Progress Bars**: Animated progress bars for skill proficiency levels.
- **Back-to-Top Button**: Appears when the user scrolls down and smoothly scrolls back to the top.
- **Blog Post Modal**: Full blog post content displayed in a modal overlay.
- **Navigation**: Responsive hamburger menu for mobile, with active link highlighting based on scroll position.

---

## Technology Stack

| Layer       | Technology                     | Purpose                                      |
|-------------|--------------------------------|----------------------------------------------|
| Front-end   | HTML5                          | Semantic page structure                       |
| Front-end   | CSS3                           | Styling, responsive design, animations        |
| Front-end   | JavaScript (ES6+)              | Dynamic interactions, Fetch API calls         |
| Back-end    | Node.js                        | JavaScript runtime for the server             |
| Back-end    | Express.js                     | Web framework for API routing and middleware   |
| Data        | JSON Files                     | Lightweight data storage (no database needed) |
| Icons       | Font Awesome 6 (CDN)           | Icon library                                  |
| Fonts       | Google Fonts (Inter, Fira Code)| Typography                                    |

---

## Project Structure

```
web_protfolio/
├── package.json                  # Project dependencies and scripts
├── README.md                     # This file - installation and run instructions
├── .gitignore                    # Git ignore rules
│
├── server/                       # Backend code
│   ├── server.js                 # Express server entry point
│   ├── data/                     # JSON data storage
│   │   ├── projects.json         # Portfolio project data
│   │   ├── blog.json             # Blog post data
│   │   └── messages.json         # Contact form messages
│   └── routes/                   # API route handlers
│       ├── projects.js           # GET/POST /api/projects
│       ├── blog.js               # GET/POST /api/blog
│       └── contact.js            # POST /api/contact, GET /api/messages
│
├── public/                       # Frontend static files (served by Express)
│   ├── index.html                # Main HTML page
│   ├── css/
│   │   └── style.css             # All styles with responsive media queries
│   └── js/
│       └── main.js               # Client-side JavaScript (dynamic interactions)
│
└── tests/                        # Test files
    └── test.js                   # API endpoint tests
```

---

## Installation & Setup

### Prerequisites

- **Node.js** (version 14 or higher) - [Download Node.js](https://nodejs.org/)
- **npm** (comes bundled with Node.js)
- A modern web browser (Chrome, Firefox, Edge, Safari)

### Step-by-Step Installation

1. **Clone the repository** (or extract the zip file):
   ```bash
   git clone <your-github-repository-url>
   cd web_protfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   This will install:
   - `express` - Web framework for the backend server
   - `cors` - Cross-Origin Resource Sharing middleware

3. **Verify the installation** by checking that a `node_modules` directory has been created.

---

## Running the Application

### Start the Server

```bash
npm start
```

This starts the Express server. You should see:
```
========================================
  Portfolio Server is running!
  Local:  http://localhost:3000
========================================
```

### Open in Browser

Navigate to **http://localhost:3000** in your web browser.

### Testing Responsive Design

- **In Browser**: Press `F12` to open Developer Tools, then click the device toggle button (or press `Ctrl+Shift+M`) to simulate different screen sizes.
- **On Mobile**: If on the same network, access the application using your computer's IP address (e.g., `http://192.168.x.x:3000`).

---

## API Endpoints

### Projects

| Method | Endpoint             | Description                          |
|--------|----------------------|--------------------------------------|
| GET    | `/api/projects`      | Get all projects                     |
| GET    | `/api/projects?category=frontend` | Filter projects by category |
| GET    | `/api/projects/:id`  | Get a single project by ID           |
| POST   | `/api/projects`      | Add a new project                    |

### Blog

| Method | Endpoint          | Description                |
|--------|-------------------|----------------------------|
| GET    | `/api/blog`       | Get all blog posts         |
| GET    | `/api/blog/:id`   | Get a single blog post     |
| POST   | `/api/blog`       | Add a new blog post        |

### Contact

| Method | Endpoint         | Description                        |
|--------|------------------|------------------------------------|
| POST   | `/api/contact`   | Submit a contact form message      |
| GET    | `/api/messages`  | Get all submitted messages         |

---

## Design Choices

### Why Vanilla HTML/CSS/JavaScript?
- Demonstrates core web development fundamentals without framework overhead.
- No build step required, making the application easy to run and deploy.
- Allows full control over the DOM and styling.

### Why Node.js + Express.js?
- Unified language (JavaScript) for both front-end and back-end.
- Express is lightweight and widely used, making it easy to set up API routes.
- Excellent ecosystem of middleware (CORS, body parsing, etc.).

### Why JSON File Storage?
- Simple and portable - no database installation required.
- Suitable for a portfolio application with a small data set.
- Data is human-readable and easy to edit manually.

### Responsive Design Approach
- **Mobile-first** mindset with progressive enhancement.
- Uses CSS Flexbox and Grid for flexible layouts.
- Four breakpoints: 360px, 480px, 768px, 992px.
- Hamburger navigation menu on smaller screens.

---

## Testing

Run the automated API tests:

```bash
npm test
```

The test suite covers:
- Server connectivity
- GET /api/projects endpoint
- GET /api/blog endpoint
- POST /api/contact (valid data)
- POST /api/contact (invalid data - missing fields)
- POST /api/contact (invalid email format)

### Manual Testing

1. **Projects Loading**: Open the application and verify projects load in the "My Projects" section.
2. **Project Filtering**: Click "Frontend" or "Full Stack" filter buttons and verify projects filter correctly.
3. **Blog Loading**: Scroll to the "Blog" section and verify blog posts are displayed.
4. **Blog Modal**: Click any blog card and verify the full post appears in a modal.
5. **Contact Form - Valid Submission**: Fill in all fields with valid data and submit. Verify success message.
6. **Contact Form - Invalid Email**: Enter an invalid email format and submit. Verify error message.
7. **Contact Form - Empty Fields**: Try submitting with empty fields. Verify validation errors appear.
8. **Responsive Design**: Resize the browser window to test at different breakpoints (desktop, tablet, mobile).
9. **Navigation**: Test the hamburger menu on mobile viewports. Verify it opens and closes correctly.
10. **Back to Top Button**: Scroll down and verify the back-to-top button appears and works correctly.

---

## License

This project is created for educational purposes as part of the **DLBCSPJWD01** course.

---

*Built with HTML, CSS, JavaScript, Node.js, and Express.js*
