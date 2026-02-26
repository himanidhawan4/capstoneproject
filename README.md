# Capstone Project
<p>This project is a user-centric web application designed to allow individuals to create accounts, publish personal blog posts, and interact with content from other users. The platform is built using the <b>MERN stack</b> (MongoDB, Express, React, and Node.js) to ensure a robust and scalable architecture.</p>

# Project Initialization
<p>The first step involved setting up a clean and organized folder structure to separate the <b>Frontend</b> and <b>Backend</b> concerns. This ensures that the application remains maintainable as features are added.</p>

**Root Directory**: Created the main workspace folder named capstoneproject.  <br>
**package.json**: Initialized the Node.js environment using npm init -y. This file serves as the manifest for the project, tracking metadata and external dependencies.<br>
**Module System**: Configured the project to use <b>ES Modules</b> by adding "type": "module" to the package settings, allowing for modern import and export syntax.<br>
# Folder Creation & Navigation
**Directory Setup**: The command mkdir backend frontend was used to create the two primary work areas.
**Navigation**: The cd (change directory) command was used to move between these folders to manage individual package.json files and dependencies.
# Initializing the Backend
<p>The backend serves as the core <b>RESTful API</b> for the blog platform. The following steps were taken to build its foundation:</p>

**Initialization**: Ran npm init -y inside the backend/ folder to create the project manifest.
**Core Packages**: Installed express for the server framework and mongoose for <b>MongoDB</b> object modeling.
**Security & Auth**: Installed bcryptjs for password hashing and jsonwebtoken (JWT) to handle secure user sessions.
**Utility Tools**: Added dotenv for environment variable protection and cors to enable communication with the frontend.
