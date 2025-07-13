# Next.js JWT One-Pass Authentication Tutorial

This project is a working example of how to implement a secure JWT-based "one-pass" authentication system in a Next.js application. "One-pass" means a single password is used to access the application, and this example demonstrates how to handle that securely.

This tutorial will walk you through the project structure, the authentication flow, and how to manage the JWT secrets.

## Getting Started

First, you'll need to set up your local development environment.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later recommended)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)

### Installation and Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/jwt-onepass.git
    cd jwt-onepass
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Create the environment file:**

    This project uses a `.env.local` file to store environment variables. Create one in the root of the project:

    ```bash
    touch .env.local
    ```

4.  **Set the initial JWT Secret:**

    The application uses a secret key to sign the JSON Web Tokens. You can generate a secure secret and set it up by running the following command:

    ```bash
    npm run rotate-secret
    ```

    This will populate your `.env.local` file with `JWT_SECRET` and `JWT_SECRET_OLD`. It will also set a default `JWT_EXPIRES_IN` value if it's not already there. Your `.env.local` should look something like this:

    ```
    JWT_SECRET=...some_long_random_string...
    JWT_SECRET_OLD=
    JWT_EXPIRES_IN=604800
    ```

5.  **Run the development server:**

    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The application will attempt to load the dashboard and, since you are not authenticated, will redirect you to the login page.

## How It Works: The Authentication Flow

The authentication is designed to be simple yet secure, handling both protecting routes and providing a good user experience.

1.  **Initial Visit:** When a user visits the root of the site (`/`), they are immediately redirected to the `/dashboard`.

2.  **Middleware (`src/middleware.ts`):**
    - The middleware intercepts requests to both `/dashboard` and `/login`.
    - It checks for the presence of the `authToken` cookie.
    - **If a user is unauthenticated** and tries to access `/dashboard`, the middleware redirects them to the `/login` page.
    - **If a user is already authenticated** and tries to access the `/login` page, the middleware redirects them to the `/dashboard`, preventing them from seeing the login form unnecessarily.

3.  **API Endpoint (`/api/auth/login`):**
    - The user submits the password on the `/login` page. The default password is an empty string for this example.
    - The password is compared against a securely hashed version using `bcrypt.compare`. This is a constant-time comparison to prevent timing attacks.
    - If the password is correct, a JWT is created using `jsonwebtoken`.
    - The JWT is then set as an `HttpOnly` cookie named `authToken`. This is crucial for security as it prevents the token from being accessed by client-side JavaScript, mitigating XSS attacks.

4.  **Logout (`/api/auth/logout`):**
    - When the user clicks the logout button, a request is sent to this endpoint.
    - The `authToken` cookie is cleared by setting its `maxAge` to a past value, effectively logging the user out.

## Secret Rotation

In a real-world application, you should regularly rotate your JWT secrets. This project includes a simple script to help with this.

To rotate the secret, run:

```bash
npm run rotate-secret
```

This script will:
1.  Read the current `JWT_SECRET` from `.env.local`.
2.  Move the current secret to `JWT_SECRET_OLD`.
3.  Generate a new cryptographically random string for `JWT_SECRET`.
4.  Update the `.env.local` file.

The application is configured to try verifying JWTs with `JWT_SECRET` first, and then with `JWT_SECRET_OLD`. This ensures that users with existing valid tokens (signed with the old secret) are not immediately logged out when you rotate the secret.

## Project Structure

Here's a breakdown of the important files and directories:

-   `src/app/`: This directory contains the pages and layouts of the application.
    -   `src/app/page.tsx`: The main landing page, which immediately redirects to `/dashboard`.
    -   `src/app/login/page.tsx`: The login form.
    -   `src/app/dashboard/page.tsx`: A protected page that only authenticated users can see.
    -   `src/app/api/auth/`: Contains the API routes for authentication.
        -   `login/route.ts`: Handles the login logic.
        -   `logout/route.ts`: Handles the logout logic.
-   `src/lib/`: Contains shared library code.
    -   `src/lib/secret.ts`: A function to get the current and old JWT secrets.
-   `src/middleware.ts`: The middleware that protects the `/dashboard` route and redirects authenticated users away from the `/login` page.
-   `scripts/rotate-secret.mjs`: The script for rotating JWT secrets.
-   `.env.local`: The file where you store your secrets and other environment variables. This file should **not** be committed to version control.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Before deploying, make sure to set the environment variables in your Vercel project settings:
-   `JWT_SECRET`: Your production JWT secret.
-   `JWT_SECRET_OLD`: Initially, this can be left blank.
-   `JWT_EXPIRES_IN`: The expiration time for your JWTs in seconds (e.g., `604800` for 7 days).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.