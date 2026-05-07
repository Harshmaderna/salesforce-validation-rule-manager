# Salesforce Validation Rule Manager

A web application that connects with Salesforce using OAuth 2.0 and allows users to fetch, activate, and deactivate Validation Rules directly from Salesforce using the Tooling API.

## Features

Salesforce OAuth Login
Fetch Validation Rules
View Validation Rule Status (Active/Inactive)
Activate/Deactivate Validation Rules
Deploy Changes to Salesforce
Logout Functionality

## Tech Stack

Frontend
React.js
Vite
Tailwind CSS

Backend
Node.js
Express.js
Salesforce Tooling API


## Installation & Setup

### Clone Repository
terminal
git clone <your-repo-url>



## Backend Setup
cd salesforce-backend
npm install
npm start
## Environment Variables
PORT=8000
SALESFORCE_CLIENT_ID=
SALESFORCE_CLIENT_SECRET=
SALESFORCE_REDIRECT_URI=
SALESFORCE_LOGIN_URL=
Backend runs on: http://localhost:8000


## Frontend Setup
cd salesforce-frontend
npm install
npm run dev
Frontend runs on: http://localhost:5173


## Application Workflow
Login with Salesforce
Fetch Validation Rules
Activate/Deactivate Validation Rules
Deploy Changes to Salesforce

Author

Harsh Maderna


