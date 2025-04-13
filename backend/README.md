
# InspireWrite Backend

InspireWrite is a full stack web application designed to empower creative writers by providing inspiration, writing prompts, and a platform to share and improve their craft. This backend repository contains the server-side logic that powers the InspireWrite application. It manages API endpoints, business logic, and data interactions, and is deployed using Cloudflare Workers. The service interacts with a PostgreSQL database via Prisma, ensuring robust and scalable data management.

---

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Setup and Installation](#setup-and-installation)
  - [Prerequisites](#prerequisites)
  - [Installation Steps](#installation-steps)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Project Description

InspireWrite is created to help users overcome writer’s block and spark creativity. The platform provides:
- **Daily Writing Prompts:** Fresh prompts to stimulate ideas.
- **Community Interaction:** Tools to share and comment on prompts and writings.
- **Personalized Experiences:** User-customized feeds based on interests and past interactions.
  
The backend is a critical component of this system. It handles:
- **Authentication & Authorization:** Managing user sessions, logins, and secure access.
- **Prompt Management:** CRUD operations (create, read, update, delete) for writing prompts.
- **User Data & Preferences:** Storing user settings, submissions, and feedback.
- **Optimized API Responses:** Serving data quickly via serverless Cloudflare Workers, ensuring a smooth user experience.

This backend is built to be flexible, scalable, and secure, adhering to modern best practices in web development and distributed architectures.

---

## Features

- **RESTful API Endpoints:** Endpoints built with the [Hono](https://hono.dev/) framework for rapid development and modular design.
- **Serverless Deployment:** Optimized for Cloudflare Workers to provide low-latency global access.
- **Database Integration:** Robust data management using PostgreSQL.
- **ORM Integration:** Type-safe and efficient database operations via Prisma.
- **Scalability & Performance:** Leveraging serverless architecture to automatically handle scale without heavy infrastructure management.

---

## Architecture Overview

The backend of InspireWrite is designed with a clear separation of concerns:
- **API Layer:** Built with Hono, this layer handles HTTP requests and routes them to appropriate business logic.
- **Business Logic & Services:** Implements all core functionality such as user authentication, prompt management, and data transformation.
- **Data Access Layer:** Uses Prisma to interact securely with PostgreSQL, abstracting raw SQL queries for increased reliability and maintainability.
- **Serverless Environment:** The entire service is deployed on Cloudflare Workers, ensuring that requests are handled at edge locations for fast global response times.

Data flows from the client-side (frontend) through the API endpoints, where the backend validates requests, processes business logic, and retrieves or updates data in the PostgreSQL database before sending a response.

---

## Technology Stack

- **Framework:** [Hono](https://hono.dev/) – a lightweight, modern web framework for building APIs.
- **Deployment:** [Cloudflare Workers](https://workers.cloudflare.com/) – serverless execution at global edge locations.
- **Database:** PostgreSQL – a powerful, open-source relational database.
- **ORM:** Prisma – a next-generation ORM that offers type safety and simple database queries.
- **Language:** JavaScript / TypeScript – providing modern language features and robust tooling.

---

## Setup and Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- npm or yarn package manager
- A PostgreSQL database instance (local or remote)
- Cloudflare account with access to Workers and Wrangler CLI
- Basic understanding of serverless deployment concepts

### Installation Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Prasadkadam03/INSPIREWRITE.git
   cd INSPIREWRITE/backend
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   # or if you use yarn:
   yarn install
   ```

3. **Generate Prisma Client:**

   If you need to generate the Prisma client after installing dependencies:

   ```bash
   npx prisma generate
   ```

---

## Configuration

Create a `.env` file in the root directory of the backend folder and populate it with your project-specific settings. For example:

```dotenv
# PostgreSQL connection string (update with your actual credentials)
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>?schema=public

# Cloudflare Workers secret or API key (if applicable)
WORKER_SECRET=<your_cloudflare_worker_secret>
```

> **Note:** Ensure that your `.env` file is added to `.gitignore` to keep sensitive information secure.

---

## Development

### Running in Development Mode

To start the server in development mode (with hot reloading if configured):

```bash
npm run dev
# or
yarn dev
```

This command uses your local environment configuration and allows you to test API endpoints on your local machine.

### Building the Project

Before deploying, compile the code into an optimized format:

```bash
npm run build
# or
yarn build
```

This command bundles your application into a format ready for deployment on Cloudflare Workers.

### Running in Production Mode Locally

Test the production build locally with:

```bash
npm start
# or
yarn start
```

---

## Deployment

Deployment is handled via the Cloudflare Workers platform using the Wrangler CLI.

### Steps for Deployment

1. **Install Wrangler (if not already installed):**

   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare:**

   ```bash
   wrangler login
   ```

3. **Configure Wrangler:**

   Edit the `wrangler.toml` file with your project details, account information, and target environment.

4. **Deploy:**

   Deploy the project to Cloudflare Workers by running:

   ```bash
   wrangler publish
   ```

The deployment process packages your bundled code, environment variables, and Cloudflare-specific settings for a seamless, global rollout.

---

## Contributing

Contributions to the InspireWrite backend are welcome! To contribute:

1. **Fork the Repository.**
2. **Create a Feature Branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit Your Changes:**

   ```bash
   git commit -m 'Add feature or fix bug'
   ```

4. **Push to Your Fork:**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request:**  
   Provide a clear description of your changes and the reasoning behind them.

For major changes, please open an issue first to discuss your ideas.

---

## Acknowledgements

- [Hono Framework](https://hono.dev/) for providing a lightweight API framework.
- [Cloudflare Workers](https://workers.cloudflare.com/) for an efficient serverless deployment platform.
- [Prisma](https://www.prisma.io/) for database management and ORM capabilities.
- Inspiration from the writing community to help creatives overcome writer’s block.
