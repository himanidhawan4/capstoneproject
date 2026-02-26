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
