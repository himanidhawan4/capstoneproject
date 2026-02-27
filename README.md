# Capstone Project

<p>This project is a user-centric web application designed to allow individuals to create accounts, publish personal blog posts, and interact with content from other users. The platform is built using the <b>MERN stack</b> (MongoDB, Express, React, and Node.js) to ensure a robust and scalable architecture.</p>



# Project Initialization

<p>The first step involved setting up a clean and organized folder structure to separate the <b>Frontend</b> and <b>Backend</b> concerns. This ensures that the application remains maintainable as features are added.</p>



 # codes used while setting environment(in command prompt)

* **mkdir capstoneproject**: Creates the root project directory.

* **cd capstoneproject**: Navigates into the project folder.

* **npm init -y**: Generates the initial package.json manifest.

* **npm install react-router-dom axios**: Installs essential frontend libraries for routing and API communication.

* **npm install express mongoose dotenv jsonwebtoken bcryptjs cors**: Installs core backend dependencies for the server, database, and security.

* **Root Directory**: Created the main workspace folder named capstoneproject.  <br>

* **package.json**: Initialized the Node.js environment using npm init -y. This file serves as the manifest for the project, tracking metadata and external dependencies.<br>

* **Module System**: Configured the project to use <b>ES Modules</b> by adding "type": "module" to the package settings, allowing for modern import and export syntax.<br>

# Folder Structure:
<p>The project is strictly divided into two main subdirectories: /backend and /frontend. The Backend houses the RESTful API, featuring a server.js entry point, a .env file for secure environment variables like MONGO_URI, and dedicated folders for Mongoose models (User and Post) and Express routes. It also includes a middleware folder containing the verifyToken logic used to protect sensitive CRUD operations.

The Frontend directory contains the React.js application, structured with an src folder that organizes the logic for user interaction and interface. The App.js file acts as the central hub for routing, utilizing the ProtectedRoute helper to gate access to the /profile and /create-post views. Feature-specific components like login.js, Register.js, PostList.js, and Profile.js are kept in the root of src, while reusable UI elements, such as the Navbar and the NotFound 404 handler, are organized within a dedicated Components subfolder. This organized approach ensures that the application remains maintainable, scalable, and meets all technical evaluation criteria. The Backend of this project serves as the engine room, responsible for data persistence, security, and the business logic that powers the entire application. It is a RESTful API built with Node.js and Express.js, using MongoDB as the primary data store.</p>

# Authentication & Security
The backend manages the entire user lifecycle. When a user registers or logs in, their password is encrypted using bcrypt.js before being stored in the database. Upon a successful login, the server generates a JSON Web Token (JWT). This token acts as a digital "passport" that the frontend must present in the headers of any request to access protected routes like creating or editing a post.

# Data Modeling & Relational Integrity
Using Mongoose, you have defined structured "Schemas" for Users and Posts. A critical feature of your backend is the Relational Mapping; every post is saved with an author field containing the MongoDB ObjectID of the user who created it.

# Middleware and API Design
The backend is structured into modular Routes (e.g., /api/auth and /api/posts). You implemented custom Middleware—specifically a verifyToken function—which sits between the request and the controller. It intercepts incoming requests, validates the JWT, and extracts the user’s identity, providing a secure "gatekeeper" for your application's data.

# .env file
The .env file is a simple text file used to store environment variables—sensitive configuration data that should stay private and separate from your application’s source code.
* Why is it important?
1. Security (Requirement 4.f): It prevents you from "hard-coding" sensitive keys. If you type your database password directly into server.js, anyone who sees your code can access your database.</p>

2. Portability: It allows you to use different settings for different environments (e.g., a local database for development and a cloud database for production) without changing the code itself.

## Initializing the Backend
<p>The backend serves as the core <b>RESTful API</b>. The following steps were taken inside the <code>/backend</code> directory:</p>

* **Initialization**: Ran `npm init -y` and added `"type": "module"` to `package.json` to enable ES Modules.
* **Core Packages**: `npm install express mongoose`
* **Security & Auth**: `npm install bcryptjs jsonwebtoken`
* **Utility Tools**: `npm install dotenv cors`

## Initializing the Frontend
<p>The frontend is built using <b>React.js</b>. The following steps were taken inside the <code>/frontend</code> directory:</p>

* **Routing**: Installed `react-router-dom` to manage navigation between Home, Login, and Register views.
* **API Communication**: Installed `axios` to handle asynchronous requests to the backend server.

## Debugging Log & Milestone Verification
<p>The development process involved iterative testing to ensure the security layer was airtight.</p>

* **Issue 1: Missing Credentials**: Resolved a <code>401 Unauthorized</code> error by correctly configuring Postman to send the JWT in the Authorization header.
* **Issue 2: ReferenceError**: Resolved a <code>500 Internal Server Error</code> caused by a missing <code>jsonwebtoken</code> import in the middleware.
* **Final Validation**: Confirmed successful database entry with a <code>201 Created</code> response, verifying that the <code>author</code> ID is correctly extracted from the JWT payload.

# Phase 1 Complete: Backend Infrastructure 
<p>The MERN backend is fully operational, secured, and validated.</p>

* **Authentication Success**: Verified the complete lifecycle of a JWT, from issuance at Login to validation in the <code>verifyToken</code> middleware.
* **Resource Creation**: Successfully performed authenticated POST requests to the <code>/api/posts</code> endpoint.
* **Relational Integrity**: Confirmed that posts are correctly mapped to their respective authors via MongoDB ObjectIDs.

## Community Feed Implementation
<p>Developed a dynamic content delivery system with granular access controls.</p>

* **Ownership-Based Controls**: Integrated conditional logic to render 'Edit' and 'Delete' triggers only for the authenticated creator of a specific post.
* **State-Driven Hydration**: Leveraged the useEffect hook for asynchronous data fetching, ensuring the feed remains synchronized with the MongoDB cluster.
* **Defensive UI Patterns**: Incorporated modal confirmation dialogues for destructive actions to mitigate accidental data loss.
* **Zero-State Fallback**: Implemented a call-to-action (CTA) interface for empty data states, improving user retention and engagement.

## Security & Content Workflow
<p>Established a secure, authenticated authoring pipeline.</p>

* **Client-Side Authorization**: Implemented automated token verification on component mount to prevent unauthorized access to authoring tools.
* **JWT Integration**: Standardized API requests with Bearer Token headers, ensuring full compatibility with the backend's Passport/JWT middleware.
* **Asynchronous UX**: Optimized the submission lifecycle with success-based navigation, routing users back to the global feed post-publication.

# Core Implementation Details
1. Backend Infrastructure (RESTful API)
Authentication: Implemented JWT (JSON Web Tokens) for stateless authentication. Passwords are secured using bcrypt.js hashing.

Relational Mapping: Established a 1-to-many relationship where posts are mapped to authors via MongoDB ObjectIDs.

Middleware: Integrated verifyToken to protect sensitive CRUD operations (Create, Edit, Delete,update).

2. Dynamic Community Feed
State Management: Leveraged React Hooks (useState, useEffect, useCallback) to manage post data and loading states.

Ownership Logic: Integrated conditional rendering so that 'Edit' and 'Delete' triggers only appear for the original author of a post.

Defensive UI: Utilized window.confirm for destructive actions to prevent accidental data loss.

3. Advanced Features & Bonus Tasks
Cross-Collection Search : Built a MongoDB Aggregation Pipeline using $lookup and $match. This enables real-time searching for posts by both Title and Author Username.

Relative Date Formatting: Implemented a custom helper function to display user-friendly dates (e.g., "Just now", "2h ago").

Custom 404 Page : Developed a dedicated "Not Found" component and catch-all routing to improve site navigation.

Debounced API Calls: Optimized performance by adding a 500ms delay to search queries to reduce unnecessary server load.
# Running of Project:

### Backend
1. Open a terminal in the `/backend` folder.
2. Run `node server.js` (or `npm start` if configured) to launch the API on port 5000.

### Frontend
1. Open a terminal in the `/frontend` folder.
2. Run `npm start` to launch the React development server on port 3000.

