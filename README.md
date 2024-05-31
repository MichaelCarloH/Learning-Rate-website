# Learning-Rate

Learning-rate is a web development project designed to facilitate learning about neural networks through interactive lessons and a dynamic playground. The application leverages modern web technologies to provide a seamless and secure user experience.

Key Features:
- Interactive neural network playground.
- Secure user authentication and registration.
- Educational lessons on neural networks.
- Real-time progress tracking and caching for efficiency.

Technologies Used:
- **React** and **Next.js** for frontend and server-side rendering.
- **Prisma ORM** for database management.
- **NextAuth** for secure authentication.
- **Tailwind CSS** for responsive and customizable UI components.
- **IntroJS** for guided lessons.

# Project Overview

## Homepage Base (with no JS)
Located in the `app` folder. All React components are in the `components` folder (inside the `app` folder) and inspired by templates from [tailblocks.cc](https://tailblocks.cc), customized by adjusting the Tailwind classes. The `page.tsx` file makes use of the following React components:

- **hero.tsx**: The first component seen under the header, with a description of the website and a picture (NeurNet.png).
- **playground_info.tsx**: Provides a description of the playground and a placeholder for a future screenshot (lmao.png).
- **lessons_info.tsx**: Describes the classes to be implemented (placeholder is still lmao.png).

All pages share the same header and footer components. The round logo uses `websitelogo.png`. All components have a scroll fade effect for a professional look. Images are in the `public` folder for faster serving. The `global.css` file is in the `styles` folder inside the `app` folder.

## About Us Page
Located in the `about` folder. The `page.tsx` file uses the following components:

- **section.tsx**: A reusable component for different sections of the page, customizable with title, paragraph, image, and layout options.
- **teamPicture.tsx**: Contains a picture of the team (`teamPicture.jpg`) with facial recognition elements.
- **facial.tsx**: SVG components for facial recognition, which trigger a popup when clicked.
- **Popup.tsx**: A general popup component used for displaying information.
- **PersonalInfo.tsx**: Displays information inside the popup.

All components have a scroll fade effect. The header and footer components, inspired by tailblocks.cc, ensure a consistent look. Images are stored in the `public` folder for faster serving.

## Sign-up Sign-in Popup Component
The registration popup enhances user experience by keeping the main page as the background. It includes a progress bar and three steps for registration. Passwords are encrypted and checked against the database. A similar popup is implemented for logging in.

## Authentication, Login, and Register
- **Registration**: Connected to the database via an API endpoint, encrypting passwords using Bcrypt’s salt and hash functions (12 salt rounds).
- **Login**: Implemented with NextAuth using email and password credentials. NextAuth supports adding oAuth providers, manages sessions using JWTs, and maintains sessions between different pages.

## Prisma ORM
Configured to connect to our MySQL server, Prisma ORM generates a Prisma client library for accessing the database through CRUD queries via the Prisma API, ensuring input sanitization and secure SQL queries.

## Data Access Layer
Instead of numerous API endpoints, a Data Access Layer (DAL) was implemented, abstracting database access to simple functions using the Prisma ORM.

## Endpoint Security via CSRF and Rate Limit Middleware
To secure API endpoints, middleware was added for CSRF token verification and IP-based rate limiting. This helps prevent excessive requests to the database and enhances security.

## Caching
Implemented NextJS’s caching on API routes to reduce database requests for static data like lessons and skill levels. Cached values update every hour, making this an effective approach for less frequently changing data.

## Pilot Lesson
Implemented using the IntroJS library for user onboarding and storyboarding. The pilot lesson walks users through the playground and explains AI concepts. User progress is maintained in the database.

## Playground
The playground consists of three main React components: **Playground**, **Canvas**, and **NodeContainer**.

- **Playground**: Contains the `Canvas` component and all sidebar components for training set selection, hyperparameter configuration, and model training.
- **Canvas**: Utilizes the React Flow library to create and connect nodes, forming Directed Acyclic Graphs (DAGs).
- **NodeContainer**: Integrates the GUI with the SmallNeuron library, building and training neural network models from user-created nodes and edges.

This setup allows for dynamic creation and training of neural networks, enhancing user interaction and learning.

## SmallNeuron
Initially planned to use TensorFlow JS, but due to its complexity, a custom library called **SmallNeuron** was created. It has a torch-like API with neuron and layer classes for easy use in the playground. It has also been published on npm for educational purposes. An extension called **SmallNeuron-Graph** integrates SmallNeuron with Graphology and Graphology-DAG libraries for building and dynamically constructing models.

## CI/CD
A testing and deployment pipeline was set up using a YAML file. This file tests the project, verifies it passes all tests, and calls a deployment script to set up the server with the latest data.