
# InspireWrite

**InspireWrite** is a full stack web application designed to empower creative writers by providing daily writing prompts, community interaction, and a supportive platform for sharing creative work. The application is divided into two main parts:

- **Frontend:** A fast and modern React application built with Vite, styled using Tailwind CSS, and leveraging React Router DOM for intuitive navigation.
- **Backend:** A serverless API built on the Hono framework, deployed on Cloudflare Workers, with PostgreSQL for data storage and Prisma as the ORM.

Experience the live application here: [INSPIREWRITE-
LiveLink](http://inspirewrite.vercel.app/)

Explore the project repository on GitHub: [INSPIREWRITE-GitHub](https://github.com/Prasadkadam03/INSPIREWRITE)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
- [Backend Setup and Installation](#backend-setup-and-installation)
- [Frontend Setup and Installation](#frontend-setup-and-installation)
- [Development & Testing](#development--testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Project Overview

InspireWrite is created to help writers overcome creative blocks and ignite their creative spark. It includes:

- **Daily Writing Prompts:** New creative prompts to inspire ideas.
- **Community Engagement:** Features for users to share their work, comment, and refine their creative process.
- **Personalized Experience:** Adaptive content feeds and tailored UI elements that respond to user interests.

With a focus on performance, scalability, and a delightful user experience, InspireWrite provides a seamless interface connecting the frontend with a robust backend.

---

## Architecture Overview

The InspireWrite system is designed with a clear separation between the frontend and backend components:

- **API Layer (Backend):**
  - **Framework:** Built with [Hono](https://hono.dev/), offering a lightweight and efficient serverless API.
  - **Deployment:** Hosted on [Cloudflare Workers](https://workers.cloudflare.com/) for global low-latency access.
  - **Database:** Utilizes PostgreSQL for structured data storage.
  - **ORM:** Uses [Prisma](https://www.prisma.io/) to simplify and secure database interactions.

- **UI Layer (Frontend):**
  - **Framework:** Developed with React for a dynamic and responsive user interface.
  - **Tooling:** Leveraging [Vite](https://vitejs.dev/) for a fast development experience and build process.
  - **Styling:** Styled with Tailwind CSS, ensuring a modern, utility-first approach to design.
  - **Routing:** Managed using React Router DOM for smooth client-side navigation.

Data flows from the user interface to the API, where backend processes handle business logic and database transactions before sending responses back to the frontend.

---

## Technology Stack

**Backend:**
- **Language/Framework:** JavaScript/TypeScript with [Hono](https://hono.dev/)
- **Deployment:** [Cloudflare Workers](https://workers.cloudflare.com/)
- **Database:** PostgreSQL
- **ORM:** [Prisma](https://www.prisma.io/)

**Frontend:**
- **Library:** [React](https://reactjs.org/)
- **Build Tool & Dev Server:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Routing:** [React Router DOM](https://reactrouter.com/)

---

## Directory Structure

A suggested project structure:

```
/INSPIREWRITE
  ├── /backend         # Backend code for the API services
  │    ├── src/        # Source code for API endpoints and business logic
  │    ├── wrangler.toml   # Cloudflare Workers configuration
  │    └── README.md   # Backend documentation
  ├── /frontend        # Frontend code for the user interface
  │    ├── public/     # Static assets like index.html, images, fonts, etc.
  │    ├── src/        # React application source code and components
  │    ├── vite.config.js  # Vite configuration file
  │    └── README.md   # Frontend documentation
  └── README.md        # This comprehensive project guide
```

---

## Getting Started

### Prerequisites

Before setting up the project locally, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- npm or yarn package manager
- Git
- A PostgreSQL database (local or remote)
- Cloudflare account (for backend deployment)

---

## Backend Setup and Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Prasadkadam03/INSPIREWRITE.git
   cd INSPIREWRITE/backend
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```
   _or_
   ```bash
   yarn install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file in the backend directory with the following variables:
   ```dotenv
   DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>?schema=public
   WORKER_SECRET=<your_cloudflare_worker_secret>
   ```

4. **Generate Prisma Client:**

   ```bash
   npx prisma generate
   ```

5. **Run in Development Mode:**

   ```bash
   npm run dev
   ```
   _or_
   ```bash
   yarn dev
   ```

6. **Deploying the Backend:**

   - Install Wrangler globally if not already installed:
     ```bash
     npm install -g wrangler
     ```
   - Login to Cloudflare:
     ```bash
     wrangler login
     ```
   - Publish your worker:
     ```bash
     wrangler publish
     ```

---

## Frontend Setup and Installation

1. **Clone the Repository:**

   From the project root, navigate to the frontend folder:
   ```bash
   cd INSPIREWRITE/frontend
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```
   _or_
   ```bash
   yarn install
   ```

3. **Configure Environment Variables (if necessary):**

   Create a `.env` file in the frontend directory. For instance:
   ```dotenv
   VITE_API_URL=https://api.yourdomain.com
   ```

4. **Run in Development Mode:**

   Start the Vite development server:
   ```bash
   npm run dev
   ```
   _or_
   ```bash
   yarn dev
   ```
   The app will typically be available at [http://localhost:3000](http://localhost:3000).

5. **Build for Production:**

   Generate the production build:
   ```bash
   npm run build
   ```
   _or_
   ```bash
   yarn build
   ```
   The build files will be located in the `dist` directory.

6. **Deploying the Frontend:**

   Deploy the production build from the `dist` folder to your preferred static hosting provider (e.g., Vercel, Netlify).

---

## Development & Testing

- **Backend Testing:**  
  Set up and run tests with your preferred testing framework (e.g., Jest) to validate API endpoints and business logic.
  
- **Frontend Testing:**  
  Use tools such as React Testing Library and Jest to test components and verify interactions.

Both parts support hot module reloading in development, making local testing and debugging efficient.

---

## Deployment

### Overall Strategy

- **Backend:**  
  Deployed on Cloudflare Workers, providing low-latency, global API access.
  
- **Frontend:**  
  Deployed as a collection of static assets to a provider like Vercel, ensuring fast and responsive content delivery.

Remember to securely manage environment variables and sensitive data during deployment.

---

## Contributing

Contributions to InspireWrite are welcome! To contribute:

1. **Fork the Repository.**
2. **Create a New Branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit Your Changes:**  
   Write clear, descriptive commit messages.
4. **Push Your Branch:**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Create a Pull Request:**  
   Provide details on your changes and why they improve the project.

Please adhere to existing coding standards and guidelines for both backend and frontend code.

---


## Acknowledgements

- **Hono:** For a lightweight and efficient API framework.
- **Cloudflare Workers:** For enabling globally distributed serverless deployments.
- **Prisma & PostgreSQL:** For streamlined, scalable database management.
- **React & Vite:** For a dynamic and fast frontend development experience.
- **Tailwind CSS:** For a modern utility-first styling approach.
- **React Router DOM:** For intuitive navigation within the app.
- **The Creative Community:** Your inspiration to build a tool that helps writers overcome creative blocks.
