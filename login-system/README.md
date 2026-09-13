# Rakshak.ai Sentinel Authentication Gateway (Node.js & Express)

A complete, production-ready full-stack authentication system matching the requested architecture: **HTML/CSS/JavaScript (Frontend)** + **Node.js & Express with Bcrypt & JWT (Backend)**.

---

## 🌟 Features

- **Frontend**: Clean Cruip Open PRO dark theme glassmorphism with dynamic tabs (Sign In, Officer Register, Instant 1-Click Demo).
- **Security**:
  - `bcryptjs` password hashing with salt (10 rounds).
  - Rate limiting (max 5 failed login attempts per IP per 15-min window).
  - JSON Web Tokens (`jwt`) for stateless session authorization.
  - Constant-time password comparison to prevent timing attacks.
- **Pre-Seeded Law Enforcement Credentials**:
  - `inspector@delhipolice.gov.in` / `Password@123` (Senior Crime Branch Inspector, Central)
  - `dispatch@delhipolice.gov.in` / `Dispatch@2026` (Rapid Patrol Dispatcher, New Delhi)
  - Public Citizen 1-click guest access.

---

## 🚀 Quickstart

1. Navigate to this directory:
   ```bash
   cd login-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser at:
   ```
   http://localhost:4000
   ```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/register` | Create a new officer/analyst account | No |
| `POST` | `/api/login` | Authenticate with email and password | No (Rate-limited) |
| `GET` | `/api/me` | Fetch authenticated officer profile | Yes (`Bearer <token>`) |
| `GET` | `/api/health` | Service health status | No |
