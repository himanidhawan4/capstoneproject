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

Core Implementation Details
1. Backend Infrastructure (RESTful API)
Authentication: Implemented JWT (JSON Web Tokens) for stateless authentication. Passwords are secured using bcrypt.js hashing.

Relational Mapping: Established a 1-to-many relationship where posts are mapped to authors via MongoDB ObjectIDs.

Middleware: Integrated verifyToken to protect sensitive CRUD operations (Create, Edit, Delete).

2. Dynamic Community Feed
State Management: Leveraged React Hooks (useState, useEffect, useCallback) to manage post data and loading states.

Ownership Logic: Integrated conditional rendering so that 'Edit' and 'Delete' triggers only appear for the original author of a post.

Defensive UI: Utilized window.confirm for destructive actions to prevent accidental data loss.

3. Advanced Features & Bonus Tasks
Cross-Collection Search (Bonus 5.b): Built a MongoDB Aggregation Pipeline using $lookup and $match. This enables real-time searching for posts by both Title and Author Username.

Relative Date Formatting (Bonus 5.d): Implemented a custom helper function to display user-friendly dates (e.g., "Just now", "2h ago").

Custom 404 Page (Bonus 5.e): Developed a dedicated "Not Found" component and catch-all routing to improve site navigation.

Debounced API Calls: Optimized performance by adding a 500ms delay to search queries to reduce unnecessary server load.

# new changes

1. Navigation & Header Enhancements
We overhauled the Navbar.js to handle authentication states and professional branding.

Dynamic Greeting: Implemented a logic that retrieves the username from localStorage to display a personalized "Hi, {username}".

Visual Avatar: Added a circular avatar (.nav-avatar) that automatically extracts and capitalizes the first letter of the logged-in user's name.

Theme Toggle: Integrated a theme switcher that toggles between ☀️ and 🌙 icons, synced with the global CSS theme state.

Auth-Based Views: Used ternary operators to show "Write" and "Profile" only when isLoggedIn is true, while showing "Join Free" for guests.

2. Routing & Content Discovery
We updated App.js and PostList.js to ensure users can actually read your history stories.

Dynamic Post Routing: Added the :id parameter to the /post/:id route, allowing a single component to render any story based on its database ID.

Public vs. Protected Access: Reorganized routes so that reading posts is public, while creating or editing posts remains behind the ProtectedRoute shield.

Debounced Search: Optimized the search bar in PostList.js with a setTimeout (500ms) to prevent excessive API calls while the user is typing.

Pagination Logic: Refined the fetchPosts function to handle "Load More" functionality, ensuring the feed stays fast even as your database grows.

3. Backend API Optimization
The posts.js router was restructured for better performance and error handling.

Single Post Endpoint: Created a GET /:id route specifically for the PostDetails page.

ID Validation: Added mongoose.Types.ObjectId.isValid() checks to prevent the server from crashing if a malformed ID is passed in the URL.

Search Aggregation: Implemented a $lookup and $match pipeline to allow users to search for stories by both Title and Author Username simultaneously.

4. Modern UI & Theming (CSS)
Your App.css now uses a scalable design system.

CSS Variables: Defined a :root and [data-theme='dark'] palette for instant color swapping without reloading the page.

Visual Polish:

Card Hovers: Added translateY(-4px) to make post cards feel interactive.

Text Transformation: Applied text-transform: capitalize to the navbar greeting so "hello" appears as "Hello".

Sticky Header: Set the navbar to sticky with a subtle box-shadow so it stays visible during long reads.

5. State & Security
Token Management: Configured the app to sync isLoggedIn with the presence of a JWT token in localStorage.

Clean Logout: Built an onLogoutClick function that clears all user data and redirects back to the login page safely.

Current Project Status
Feed: Fully searchable and paginated.

Reading: "Read Full Story" correctly fetches data from the backend.

Profile: Correcty counts and displays "Your Stories."

UI: Full Dark/Light mode support.

