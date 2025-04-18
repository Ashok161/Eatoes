# The Digital Diner - Mini Restaurant Ordering System

## Overview

This is a prototype of a simple online ordering system for "The Digital Diner" restaurant. Users can browse the menu, add items to a cart, and place pickup orders.

## Technical Stack

* **Frontend:** React (Vite)
* **Backend:** Node.js, Express
* **Database (Menu):** MongoDB
* **Database (Orders):** PostgreSQL

## Database Design Choices

* **MongoDB:** Used for storing menu items. The schema for menu items (name, description, price, category, image URL) is flexible and might evolve over time with varying details for different food types. MongoDB's document-based structure is well-suited for this potentially less rigidly structured data. Querying by category is also straightforward.
* **PostgreSQL:** Used for storing order and customer information. Orders have a more structured nature, requiring relational integrity (customer details associated with specific orders). PostgreSQL's relational database capabilities ensure data consistency and allow for efficient querying of orders based on customer information (e.g., by phone number). Storing `cartItems` as a JSONB column leverages PostgreSQL's ability to efficiently query within JSON data if needed in the future.

## Backend Setup (Local)

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-link>
    cd digital-diner/backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    * Create a `.env` file in the `backend` directory.
    * Add your MongoDB connection string (`MONGO_URI`), PostgreSQL connection string (`DATABASE_URL`), backend server port (`PORT`), and the frontend URL for CORS (`CLIENT_URL`). **Do not commit this file.**
        ```
        PORT=5001
        MONGO_URI=mongodb+srv://<your_mongo_user>:<your_mongo_password>@<your_cluster_url>/digitalDinerDB?retryWrites=true&w=majority
        DATABASE_URL=postgresql://<your_pg_user>:<your_pg_password>@localhost:5432/<your_pg_database_name>
        CLIENT_URL=http://localhost:3000
        ```
4.  **Start the backend server:**
    ```bash
    npm run dev
    ```
    This will start the server with nodemon for automatic restarts on code changes.

## Frontend Setup (Local)

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    * Create a `.env` file in the `frontend` directory.
    * Add the URL of your backend API:
        ```
        VITE_API_URL=http://localhost:5001/api
        ```
4.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    This will usually start the React app at `http://localhost:3000`.

## API Endpoints

**Menu Routes (`/api/menu`)**

* `GET /`: Get all menu items (optional `?category=...` query parameter).
* `GET /:id`: Get a single menu item by ID.
* `POST /`: Create a new menu item (for testing/admin).
* `PUT /:id`: Update a menu item (for testing/admin).
* `DELETE /:id`: Delete a menu item (for testing/admin).

**Order Routes (`/api/orders`)**

* `POST /`: Place a new order (requires `customerName`, `customerPhone`, and `cartItems` in the request body).
* `GET /:phone`: Get all orders associated with a given phone number.

## Deployed Frontend

[Link to your Netlify deployed frontend application will go here]

## Assumptions Made

* Basic error handling is implemented on both the frontend and backend.
* No user authentication is implemented (order history is based solely on the provided phone number).
* No payment processing is integrated.
* Menu item management (create, update, delete) is only accessible via API calls (e.g., using Postman) and not through a dedicated admin UI.
* Cart data is stored in the browser's local storage for simplicity.

## Challenges Faced

* Deciding on the appropriate data to store in MongoDB vs. PostgreSQL and justifying those choices.
* Ensuring correct data flow between the frontend and backend, especially with item IDs from MongoDB being used in order creation in PostgreSQL.
* Configuring CORS correctly for local development and the deployed frontend.
* Basic validation of user inputs on both the frontend and backend.

## Git Repository

[Link to your Git repository (GitHub, GitLab)]