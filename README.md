# Fashion E-Commerce Project Guide

Welcome to the Fashion E-Commerce project! This guide will help you understand the project structure, how the different parts work together, and the decisions made during development.

## 🏗️ Architecture

This project follows a **Client-Server** architecture, which is a very common pattern in web development. We have separated the code into two main folders:

### 1. Client (`/client`)
This is the **Frontend**. It's what the user sees and interacts with in their browser.
- **Technology:** React (built with Vite), TypeScript.
- **Styling:** Tailwind CSS (for easy styling), Shadcn UI (for pre-built components like Buttons).
- **Communication:** It talks to the Server to get data (like products) and send data (like adding items to cart).

### 2. Server (`/server`)
This is the **Backend**. It handles the logic, data storage, and security.
- **Technology:** Node.js with Express (a framework for building APIs).
- **Database:** PostgreSQL (managed by Prisma ORM).
- **Role:** It receives requests from the Client, talks to the Database, and sends responses back.

### 3. Workflows (`/.github`)
This folder contains automation scripts for GitHub.
- **CI/CD:** We have a workflow that automatically installs dependencies and runs tests whenever you push code or open a Pull Request. This ensures specific changes don't break existing features.
- **Dependabot:** A tool that automatically checks if your libraries (dependencies) are out of date and suggests updates.

---

## 🔄 Workflow: How It Works

Imagine a user wants to view products:

1.  **User Action:** User visits the homepage.
2.  **Client Request:** The React app sends a GET request to `http://localhost:5000/products`.
3.  **Server Processing:** The Express server receives this request.
4.  **Database Query:** The server asks the Database (via Prisma) for the list of products.
5.  **Response:** The Database returns the data, and the Server sends it back to the Client as JSON.
6.  **Display:** The React app receives the JSON and displays the products on the screen.

---

## 🧪 Testing Strategy

We added tests to ensure reliability. We use **Jest** and **React Testing Library**.

### Unit Tests
These test individual small parts in isolation.
- **Example:** checking if a Button renders text correctly or if a utility function `cn()` combines class names properly.
- **Location:** Inside `client/src/components` next to the files they test.

### Integration Tests
These test how different parts work together.
- **Frontend Integration:** Checks if the App can fetch data (simulated) and update the screen.
- **Backend Integration:** Checks if the API endpoints (like `/products`) return the expected data structure. To verify behavior without needing a real running database during tests, we "mocked" (simulated) the database and authentication.

---

## 🛠️ Key Improvements & Decisions

1.  **Root Restructuring:**
    - We moved everything into specific `client` and `server` directories.
    - **Why?** It keeps the project clean and organized. It prevents conflicts between frontend and backend dependencies (e.g., different versions of the same library).

2.  **Idempotent Scripts:**
    - We verified that scripts like database seeding (`npm run seed`) can be run multiple times without causing errors or duplicating data.
    - **Why?** This makes it safe for you to run setup commands repeatedly if something goes wrong, without breaking your database.

3.  **CI/CD Pipeline:**
    - We added a GitHub Action to run tests automatically.
    - **Why?** This creates a safety net. If you accidentally break something, the automated system will tell you before you merge your code.

4.  **Mocking in Tests:**
    - For backend tests, we mocked the database.
    - **Why?** This makes tests run extremely fast and means you don't need to have a Postgres database running just to verify your code logic.

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your machine.
- PostgreSQL installed and running (for the actual app, not for tests).

### Running the Project

**1. Install Dependencies:**
```bash
# In the client folder
cd client
npm install

# In the server folder (open a new terminal)
cd server
npm install
```

**2. Run Tests:**
```bash
# Client Tests
cd client
npm test

# Server Tests
cd server
npm test
```

**3. Run the App:**
You will need two terminals running at the same time:

Terminal 1 (Server):
```bash
cd server
npm run dev
```

Terminal 2 (Client):
```bash
cd client
npm run dev
```

Happy Coding! 🚀
