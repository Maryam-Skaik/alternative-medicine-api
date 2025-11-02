
# 🧪 Alternative Medicine API
A Node.js RESTful API designed to manage and provide access to alternative medicine data including drugs, pharmacies, and user authentication. Built with **Express.js**, **MongoDB**, and **JWT** authentication.

---

## 📘 Table of Contents
1. 🧪 [Overview](#overview)
2. 📌 [Project Scope](#project-scope)
3. ⚡ [Features](#features)
4. 🗂️ [Project Structure](#project-structure)
5. 🛠️ [Tech Stack](#tech-stack)
6. 💻 [Installation](#installation)
7. 🔑 [Environment Variables](#environment-variables)
8. 🚀 [Running the Project](#running-the-project)
9. 📬 [API Routes (Postman Collection)](#api-routes-postman-collection)
10. ⚙️ [Scripts](#scripts)
11. 📝 [License](#license)
12. ℹ️ [Project Info](#project-info)

---

## 🧪 Overview

The **Alternative Medicine API** provides endpoints for managing drug and pharmacy information.  
It allows a single administrator to securely manage drugs, pharmacies, and alternative medicines for unavailable drugs.

---

## 📌 Project Scope

- Backend API only, no frontend.
- Single administrator manages the platform.
- Manage drugs, pharmacies, and alternative medicine data.
- Supports login/logout for admin authentication.
- CRUD operations for drugs and pharmacies.
- Allows adding alternative drugs for unavailable medications with mapped pharmacies.

---

## ⚡ Features

- Single admin user authentication (login/logout) using JWT.
- CRUD endpoints for drugs and pharmacies with alternative medicine mapping.
- Track alternative medicines for unavailable drugs.
- MongoDB database integration.
- Centralized validation and error handling.
- Modular architecture for easy scalability.
---

## 🗂️ Project Structure

```text
alternative-medicine-api/
│
├── app.js
├── index.js
├── package.json
│
├── configurations/
│ ├── db.js
│ ├── private.key
│ └── index.js
│
├── controllers/
│ ├── authController.js
│ ├── drugController.js
│ └── pharmacyController.js
│
├── middlewares/
│ └── auth.js
│
├── models/
│ ├── Drug.js
│ ├── Pharmacy.js
│ └── User.js
│
├── routes/
│ ├── auth.js
│ ├── drug.js
│ └── pharmacy.js
│
├── validators/
│ ├── drug.js
│ ├── pharmacy.js
│ └── user.js
│
└── script/
└── addAdmin.js
```

---

## 🛠️ Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB / Mongoose**
- **JWT Authentication**
- **dotenv**
- **bcryptjs**

---

## 💻 Installation

### 1. Clone the repository
```bash
git clone https://github.com/Maryam-Skaik/alternative-medicine-api.git
cd alternative-medicine-api
```

### 2. Install dependencies
```bash
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following keys:
```bash
PORT=3000
MONGO_URI=mongodb://localhost:27017/alternative-medicine
JWT_PRIVATE_KEY=your_jwt_secret_key
```

---

## 🚀 Running the Project
The server runs by default on http://localhost:5000

### Start Server (Development)
```bash
npm start
```

The server runs by default on http://localhost:5000

---

## 📬 API Routes (Postman Collection)

### 🔐 Authentication
| Method | Endpoint                  | Description       | Auth Required |
|--------|---------------------------|-----------------|---------------|
| POST   | /auth/login               | Login user/admin | No            |
| POST   | /auth/logout              | Logout user      | Yes           |

### 🏥 Pharmacies
| Method | Endpoint                                   | Description                  | Auth Required |
|--------|--------------------------------------------|------------------------------|---------------|
| POST   | /pharmacies/add                            | Add new pharmacy             | Yes           |
| PUT    | /pharmacies/update/:id                      | Update pharmacy by ID        | Yes           |
| GET    | /pharmacies?page=2                           | Get all pharmacies (paged)   | Yes           |
| GET    | /pharmacies/pages                            | Test wrong input / no drugs  | Yes           |
| GET    | /pharmacies/:id                              | Get pharmacy by ID           | Yes           |
| DELETE | /pharmacies/delete/:id                       | Delete pharmacy by ID        | Yes           |

### 💊 Drugs
| Method | Endpoint                     | Description                  | Auth Required |
|--------|------------------------------|------------------------------|---------------|
| POST   | /drugs/add                   | Add new drug                 | Yes           |
| GET    | /drugs                        | Get all drugs                | Yes           |
| PUT    | /drugs/update/:id             | Update drug by ID            | Yes           |
| DELETE | /drugs/delete/:id             | Delete drug by ID            | Yes           |
| GET    | /drugs/byName?name=DrugName   | Get drug by name             | Yes           |

---

## 📬 Example Postman Collection

You can test all API endpoints using the provided Postman collection.  

**File:** [`Alternative Medicine.postman_collection.json`](./Alternative%20Medicine.postman_collection.json)

**Instructions:**
1. Download or clone the repo.
2. Open Postman.
3. Import the collection file.
4. Replace `{{base_url}}` with your server URL (e.g., `http://localhost:5000`).
5. Replace `{{JWT_TOKEN}}` with your admin JWT token for authenticated requests.

---

## ⚙️ Scripts

| Command   | Description                        |
|-----------|------------------------------------|
| npm start | Run server with nodemon (development) |

---

## 📝 License

This project is open-source and available under the MIT License

---

## ℹ️ Project Info

**Author: Maryam Skaik**
**Version:** 1.0.0
**Status:** Development Complete 🚀
