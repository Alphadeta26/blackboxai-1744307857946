# Library Management System

A modern web-based Library Management System built with Node.js, Express, Oracle Database, and Tailwind CSS.

## Features

- User Authentication
- Books Management (Add, Edit, Delete, Search)
- Members Management (Add, Edit, Delete, Search)
- Dashboard with Statistics
- Modern UI with Tailwind CSS
- Responsive Design
- Error Handling
- Logging System

## Prerequisites

- Node.js (v14 or higher)
- Oracle Database
- NPM or Yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd library-management
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory:
```env
DB_USER=your_username
DB_PASSWORD=your_password
DB_CONNECT_STRING=your_connection_string
PORT=8000
```

4. Set up the database:
- Connect to your Oracle database
- Execute the database_setup.sql script

5. Start the application:
```bash
npm start
```

6. Access the application at http://localhost:8000

## Default Login Credentials

- Username: admin
- Password: admin123

## Project Structure

```
library-management/
├── controllers/          # Route controllers
├── routes/              # Express routes
├── views/               # HTML views
├── utils/              # Utility functions
├── config.js           # Configuration
├── server.js           # Express app
└── database_setup.sql  # Database schema
```

## API Endpoints

### Authentication
- POST /api/auth/login
- GET /api/auth/logout

### Books
- GET /api/books
- GET /api/books/:id
- POST /api/books
- PUT /api/books/:id
- DELETE /api/books/:id

### Members
- GET /api/members
- GET /api/members/:id
- POST /api/members
- PUT /api/members/:id
- DELETE /api/members/:id

## Database Schema

### LIBRARY_USERS
- ID (Primary Key)
- USERNAME (Unique)
- PASSWORD
- ROLE
- CREATED_AT

### BOOKS
- ID (Primary Key)
- TITLE
- AUTHOR
- ISBN (Unique)
- CATEGORY
- QUANTITY
- CREATED_AT
- UPDATED_AT

### LIBRARY_MEMBERS
- ID (Primary Key)
- FIRST_NAME
- LAST_NAME
- EMAIL (Unique)
- PHONE
- ADDRESS
- JOIN_DATE
- STATUS
- CREATED_AT
- UPDATED_AT

### BOOK_LOANS
- ID (Primary Key)
- BOOK_ID (Foreign Key)
- MEMBER_ID (Foreign Key)
- BORROW_DATE
- DUE_DATE
- RETURN_DATE
- STATUS
- CREATED_AT

## Security Features

- Password hashing (in a production environment)
- Input validation
- SQL injection prevention
- Error handling and logging
- Session management

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
