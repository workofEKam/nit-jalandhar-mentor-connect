# NIT Jalandhar - Mentor Connect Hackathon Platform

A complete web application for managing hackathons at NIT Jalandhar, built with Node.js, Express, EJS, and MongoDB.

## Features

### User Features
- User registration and authentication
- Browse available hackathons
- Register for hackathons with team details
- View registration status and history
- Responsive design with Tailwind CSS

### Admin Features
- Admin dashboard with statistics
- Create and manage hackathons
- View all registrations for each hackathon
- Export registration data to CSV
- Monitor user activity

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Frontend**: EJS templating, Tailwind CSS
- **Authentication**: bcrypt for password hashing
- **Session Management**: express-session, cookie-parser

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nit-jalandhar-mentor-connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   mongod
   ```

4. **Setup database with sample data**
   ```bash
   node setup.js
   ```

5. **Start the application**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open your browser and go to `http://localhost:3000`

## Default Credentials

After running the setup script, you can login with:

**Admin Account:**
- Email: `admin@nitj.ac.in`
- Password: `admin123`

**Sample Student Accounts (optional):**
Run `node add-sample-users.js` to create sample users from different branches:
- Password for all sample users: `student123`

## Available Branches

The platform supports the following NIT Jalandhar branches:
- **CSE** - Computer Science Engineering
- **ECE** - Electronics & Communication Engineering  
- **ME** - Mechanical Engineering
- **CE** - Civil Engineering
- **EE** - Electrical Engineering
- **IT** - Information Technology
- **DS** - Data Science
- **TT** - Textile Technology
- **MNC** - Mathematics and Computing
- **ICE** - Instrumentation & Control Engineering
- **CHE** - Chemical Engineering

## Project Structure

```
├── app.js                 # Main application file
├── package.json          # Dependencies and scripts
├── setup.js              # Database setup script
├── models/               # MongoDB models
│   ├── User.js
│   ├── Hackathon.js
│   └── Registration.js
├── routes/               # Express routes
│   ├── auth.js          # Authentication routes
│   ├── user.js          # User dashboard routes
│   └── admin.js         # Admin panel routes
└── views/                # EJS templates
    ├── layout.ejs       # Main layout template
    ├── index.ejs        # Homepage
    ├── auth/            # Authentication pages
    ├── user/            # User dashboard pages
    └── admin/           # Admin panel pages
```

## Usage

### For Students
1. Register with your NIT Jalandhar details
2. Browse available hackathons
3. Register for hackathons with your team
4. Track your registration status

### For Admins
1. Login with admin credentials
2. Create new hackathons with details
3. Monitor registrations and participants
4. Export data for analysis

## API Endpoints

### Authentication
- `GET /auth/login` - Login page
- `POST /auth/login` - Process login
- `GET /auth/register` - Registration page
- `POST /auth/register` - Process registration
- `GET /auth/logout` - Logout user

### User Routes
- `GET /user/dashboard` - User dashboard
- `GET /user/register/:id` - Hackathon registration form
- `POST /user/register/:id` - Submit hackathon registration

### Admin Routes
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/create-hackathon` - Create hackathon form
- `POST /admin/create-hackathon` - Submit new hackathon
- `GET /admin/hackathon/:id/registrations` - View registrations

## Database Schema

### User Model
- name, email, password (hashed)
- rollNumber, branch, year, phone
- isAdmin (boolean)

### Hackathon Model
- title, description
- startDate, endDate, registrationDeadline
- maxParticipants, prizes, rules
- isActive (boolean)

### Registration Model
- user (reference to User)
- hackathon (reference to Hackathon)
- teamName, teamMembers, projectIdea
- status (pending/approved/rejected)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.