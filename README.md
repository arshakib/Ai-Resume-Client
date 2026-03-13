# 🚀 AI Resume Risk Analyzer (SaaS)

An enterprise-grade, full-stack SaaS application that allows users to securely upload PDF resumes and receive structured, AI-powered risk analysis and actionable feedback. Features a Dual-Database architecture, strict TypeScript validation across the stack, and Stripe payment integration for premium role-based access.

### 🌐 Live Links
* **Live Application:** [https://ai-resume-client-five.vercel.app/](https://ai-resume-client-five.vercel.app/)
* **Backend API Base URL:**[https://ai-resume-server-swart.vercel.app/](https://ai-resume-server-swart.vercel.app/)
* **Server Repository:**[https://github.com/arshakib/Ai-Resume-Server](https://github.com/arshakib/Ai-Resume-Server)

---

## ✨ Key Features

*   **🧠 Advanced AI Analysis:** Integrates **Google Gemini 1.5 Flash** with strict JSON prompt engineering to calculate ATS rejection risk, impact power, and line-by-line feedback.
*   **🔒 Absolute Data Privacy (Client-Side PDF Parsing):** Uses `pdfjs-dist` Web Workers to extract text from PDFs *entirely in the browser*. Raw files are never sent to the server, saving bandwidth and ensuring user privacy.
*   **🗄️ Dual-Database Architecture:** 
    *   **PostgreSQL (Prisma):** Handles highly structured, relational data (Users, Roles, Payments) ensuring ACID compliance.
    *   **MongoDB (Mongoose):** Handles deeply nested, unpredictable AI JSON arrays and unstructured resume history.
*   **💳 Premium Feature Gating & Monetization:** Integrated **Stripe Checkout**. Free users hit a conversion paywall, while Premium users unlock unlimited AI scans. Role-Based Access Control (RBAC) middleware protects backend routes.
*   **⚡ Optimistic UI & Caching:** Uses **TanStack Query** for zero-lag data fetching, cache invalidation, and skeleton loading states.
*   **🎨 Premium Glassmorphism UI:** Built with **Tailwind CSS v4** and **Framer Motion**. Features 3D floating cards, glowing orbs, staggered list animations, and dark-mode default styling.
*   **🛡️ End-to-End Type Safety:** Uses **Zod** to share validation schemas between React Hook Form (frontend) and Express Middleware (backend).

---

## 🛠️ Tech Stack

### Frontend (Client)
*   **Core:** React 18, Vite, TypeScript
*   **State Management:** Redux Toolkit (Auth/UI State), TanStack Query (Server State/Caching)
*   **Routing:** React Router DOM v6
*   **Styling & Animation:** Tailwind CSS v4, Framer Motion, Lucide React (Icons)
*   **Forms & Validation:** React Hook Form, Zod
*   **Utilities:** `pdfjs-dist` (In-browser PDF text extraction), Axios (Interceptors)
*   **Hosting:** Vercel

### Backend (API Gateway)
*   **Core:** Node.js, Express.js, TypeScript
*   **Authentication:** Stateless JWT (JSON Web Tokens), Bcrypt (Password Hashing)
*   **Validation:** Zod (Middleware for `req.body`)
*   **AI Integration:** `@google/generative-ai` SDK
*   **Payments:** Stripe Node.js SDK
*   **Hosting:** Vercel

### Databases & ORMs
*   **Relational DB:** PostgreSQL (via Prisma ORM)
*   **Document DB:** MongoDB (via Mongoose ODM)

---

## 🏗️ System Architecture Flow

1. **User Action:** User uploads a PDF on the React Frontend.
2. **Client Processing:** Vite Web Worker runs `pdf.js` to extract raw text (Browser-only).
3. **API Request:** Axios Interceptor attaches JWT and sends text to Express Backend.
4. **Auth & Validation:** Express verifies JWT and passes data through Zod Schema Middleware.
5. **AI Processing:** Express sends a strict prompt to Google Gemini AI, forcing an `application/json` response.
6. **Dual-DB Save:** Express saves the AI JSON to **MongoDB**, linked to the User's ID from **PostgreSQL**.
7. **UI Update:** TanStack Query invalidates the cache, triggering Framer Motion to slide the new analysis card onto the user's dashboard instantly.

---

## 💻 Getting Started (Local Development)

### Prerequisites
*   Node.js (v18+ recommended)
*   PostgreSQL installed locally (or a cloud DB like Neon.tech/Supabase)
*   MongoDB installed locally (or a cluster on MongoDB Atlas)
*   Google Gemini API Key
*   Stripe Developer Account

### 1. Backend Setup
git clone https://github.com/arshakib/Ai-Resume-Server.git
cd Ai-Resume-Server
npm install

# Setup Prisma Database
npx prisma generate
npx prisma migrate dev --name init

Create a .env file in the server directory:

Env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/resumeai" 
MONGO_URI="mongodb+srv://user:password@cluster.mongodb.net/resumeai" 
JWT_SECRET="your_super_secret_jwt_key"
GEMINI_API_KEY="your_google_gemini_key"
STRIPE_SECRET_KEY="sk_test_your_stripe_key"
CLIENT_URL="http://localhost:5173"


Start the backend server:
npm run dev


2. Frontend Setup
(Note: Ensure you have your frontend code in a separate repository/folder)

cd ai-resume-client
npm install
Create a .env file in the frontend directory:
code
Env
VITE_API_URL="http://localhost:5000/api"

Start the Vite development server:
npm run dev
📡 API Endpoints Overview
Method	Endpoint	Description	Protected	Role
POST	/api/auth/register	Register a new user	❌	Any
POST	/api/auth/login	Authenticate and get JWT	❌	Any
GET	/api/resume/history	Fetch MongoDB resume analyses	✅	Any
POST	/api/resume/analyze	Call AI & save to MongoDB	✅	PREMIUM
POST	/api/payment/create-checkout-session	Generate Stripe URL	✅	USER
POST	/api/payment/verify-session	Verify payment & Upgrade Role	✅	USER

🚀 Future Roadmap
OAuth2 Integration: Add "Sign in with Google/GitHub".
Export Feature: Allow users to export their AI report as a beautifully formatted PDF.
Subscription Webhooks: Replace session verification with full Stripe CLI Webhooks for recurring monthly subscriptions.
Admin Dashboard: Create a /admin route for users with the ADMIN role to view total revenue and user statistics.

🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

📄 License
This project is MIT licensed.


Built with ❤️ by Ar Shakib | Full-Stack Software Engineer
