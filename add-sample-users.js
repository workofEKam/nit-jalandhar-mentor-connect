const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

async function addSampleUsers() {
    try {
        await mongoose.connect('mongodb://localhost:27017/nit-mentor-connect', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        const sampleUsers = [
            {
                name: 'Arjun Sharma',
                email: 'arjun.ds@nitj.ac.in',
                rollNumber: '21DS001',
                branch: 'DS',
                year: 3,
                phone: '9876543211',
                gender: 'Male'
            },
            {
                name: 'Priya Patel',
                email: 'priya.tt@nitj.ac.in',
                rollNumber: '21TT002',
                branch: 'TT',
                year: 3,
                phone: '9876543212',
                gender: 'Female'
            },
            {
                name: 'Rahul Kumar',
                email: 'rahul.mnc@nitj.ac.in',
                rollNumber: '21MNC003',
                branch: 'MNC',
                year: 2,
                phone: '9876543213',
                gender: 'Male'
            },
            {
                name: 'Sneha Singh',
                email: 'sneha.ice@nitj.ac.in',
                rollNumber: '21ICE004',
                branch: 'ICE',
                year: 2,
                phone: '9876543214',
                gender: 'Female'
            },
            {
                name: 'Vikash Gupta',
                email: 'vikash.che@nitj.ac.in',
                rollNumber: '21CHE005',
                branch: 'CHE',
                year: 3,
                phone: '9876543215',
                gender: 'Male'
            }
        ];

        const password = await bcrypt.hash('student123', 10);

        for (const userData of sampleUsers) {
            const existingUser = await User.findOne({ email: userData.email });
            if (!existingUser) {
                const user = new User({
                    ...userData,
                    password: password
                });
                await user.save();
                console.log(`Created user: ${userData.name} (${userData.branch})`);
            } else {
                console.log(`User already exists: ${userData.email}`);
            }
        }

        console.log('Sample users creation completed!');
        console.log('All sample users have password: student123');
        process.exit(0);

    } catch (error) {
        console.error('Failed to add sample users:', error);
        process.exit(1);
    }
}

addSampleUsers();