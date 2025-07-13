# LLM Prompt: Create a Secure Next.js "One-Pass" Authentication Application

Hello! I need you to act as an expert full-stack developer and create a secure Next.js application that uses a "one-pass" (single password) authentication system with JWTs.

Please follow these steps methodically. The final application should be secure, well-documented, and free of boilerplate code.

**Phase 1: Project Setup and Basic UI**

1.  **Initialize a Next.js App:**
    -   Use `create-next-app` with TypeScript and Tailwind CSS.
    -   Name the project `jwt-onepass`.

2.  **Create UI Pages:**
    -   **Login Page (`src/app/login/page.tsx`):** Create a simple, centered form with a single password input field and a "Login" button. Do not worry about state management yet.
    -   **Dashboard Page (`src/app/dashboard/page.tsx`):** Create a protected page that displays a "Welcome, you are logged in!" message and a "Logout" button.

3.  **Create the Root Page (`src/app/page.tsx`):**
    -   This page should contain no UI. It should simply use `redirect` from `next/navigation` to immediately forward the user to `/dashboard`.

**Phase 2: Core Authentication and JWT Logic**

1.  **Install Dependencies:**
    -   Install `jsonwebtoken`, `bcryptjs`, and `cookie`.
    -   Install the corresponding type definitions: `@types/jsonwebtoken`, `@types/bcryptjs`, `@types/cookie`.

2.  **Environment Setup and Secret Rotation:**
    -   Create a `.env.local` file. This file will store `JWT_SECRET`, `JWT_SECRET_OLD`, and `JWT_EXPIRES_IN`.
    -   Create a script at `scripts/rotate-secret.mjs`. This Node.js script should:
        -   Generate a new 32-byte, `base64url`-encoded secret.
        -   Read the existing `JWT_SECRET` from `.env.local` and move it to `JWT_SECRET_OLD`.
        -   Write the new secret to `JWT_SECRET`.
        -   If `JWT_EXPIRES_IN` is not set, default it to `604800` (7 days).
    -   Create a helper function at `src/lib/secret.ts` that safely reads `JWT_SECRET` and `JWT_SECRET_OLD` from the environment variables. This function should allow the application to verify tokens against both the current and the old secret to prevent users from being logged out during rotation.

3.  **Create API Endpoints:**
    -   **Login (`src/app/api/auth/login/route.ts`):**
        -   Accept a `POST` request with a `password` in the JSON body.
        -   For this example, the correct password will be an empty string (`""`).
        -   Hash this correct password using `bcryptjs` and store the hash in a constant. **Do not store the plaintext password in the code.**
        -   Use `bcrypt.compare` to check the submitted password against the stored hash in a constant-time manner.
        -   If the password is correct, generate a JWT signed with `HS256`. The payload should contain `{ sub: "admin" }`.
        -   Set the JWT in a cookie named `authToken`. This cookie **must** be `HttpOnly`, `secure` in production, have `sameSite: "lax"`, a `maxAge`, and be scoped to the `path: "/"`.
        -   Return a success response.
        -   If the password is incorrect, return a `401 Unauthorized` error.
    -   **Logout (`src/app/api/auth/logout/route.ts`):**
        -   Accept a `POST` request.
        -   Clear the `authToken` cookie by setting its `maxAge` to `-1`.
        -   Return a success response.

**Phase 3: Middleware and Route Protection**

1.  **Create Middleware (`src/middleware.ts`):**
    -   The middleware should run on all requests to `/dashboard/:path*` and `/login`.
    -   It should check for the `authToken` cookie.
    -   **Rule 1:** If a user is **unauthenticated** (no token) and tries to access `/dashboard`, redirect them to `/login`.
    -   **Rule 2:** If a user is **authenticated** (has a token) and tries to access `/login`, redirect them to `/dashboard`.
    -   In all other cases, allow the request to proceed.

**Phase 4: Advanced Security Enhancements**

1.  **Implement Rate Limiting on Login:**
    -   Install `@upstash/ratelimit` and `@upstash/redis`.
    -   In the `src/app/api/auth/login/route.ts` file, create a new rate limiter using Upstash Redis.
    -   Configure it to allow a maximum of 5 login attempts per minute from a single IP address.
    -   Use the `x-forwarded-for` header or the request's IP address as the identifier.
    -   If the rate limit is exceeded, return a `429 Too Many Requests` error response.
    -   Add comments explaining that Upstash Redis credentials (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`) must be added to the `.env.local` file.

**Phase 5: Documentation and Code Cleanup**

1.  **Create a Comprehensive `README.md`:**
    -   Rewrite the entire `README.md` file in the style of a tutorial.
    -   It should clearly explain the project's purpose and security features.
    -   Provide detailed, step-by-step instructions for:
        -   Cloning the repository.
        -   Installing dependencies.
        -   Setting up the `.env.local` file, including the Upstash Redis credentials.
        -   Running the `rotate-secret` script.
        -   Starting the development server.
    -   Include a section that explains the complete authentication flow, including the roles of the middleware, rate limiting, and secret rotation.

2.  **Code Cleanup:**
    -   Delete any unused files from the `create-next-app` template, such as the default SVG logo files in the `public` directory.
    -   Simplify `src/app/globals.css` by removing all the default boilerplate styles, leaving only the `@import "tailwindcss";` and a comment explaining that global styles should primarily be handled in the root layout.

After completing all these steps, please provide the final, complete codebase.
