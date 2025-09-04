const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Hackathon = require('./models/Hackathon');

// Use production MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://hackmantor:EKsingh%23%402004@cluster60199.zs0l0bn.mongodb.net/nit-mentor-connect?retryWrites=true&w=majority&appName=Cluster60199';

async function setupProductionDatabase() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to Production MongoDB');
        
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@nitj.ac.in' });
        if (existingAdmin) {
            console.log('✅ Admin user already exists');
        } else {
            const adminPassword = await bcrypt.hash('admin123', 12);
            const admin = new User({
                name: 'Admin User',
                email: 'admin@nitj.ac.in',
                password: adminPassword,
                rollNumber: 'ADMIN001',
                branch: 'CSE',
                year: 4,
                phone: '9876543210',
                gender: 'Other',
                isAdmin: true
            });
            await admin.save();
            console.log('✅ Admin user created: admin@nitj.ac.in / admin123');
        }

        // Check if sample hackathon already exists
        const existingHackathon = await Hackathon.findOne({ title: 'NIT Jalandhar Tech Innovation Challenge 2025' });
        if (existingHackathon) {
            console.log('✅ Sample hackathon already exists');
        } else {
            const sampleHackathon = new Hackathon({
                title: 'NIT Jalandhar Tech Innovation Challenge 2025',
                description: 'A 48-hour hackathon focused on developing innovative solutions for real-world problems using cutting-edge technologies like AI, ML, IoT, and Blockchain.',
                startDate: new Date('2025-03-15T09:00:00'),
                endDate: new Date('2025-03-17T18:00:00'),
                registrationDeadline: new Date('2025-03-10T23:59:59'),
                maxParticipants: 200,
                prizes: '1st Prize: ₹1,00,000, 2nd Prize: ₹50,000, 3rd Prize: ₹25,000, Special Category Prizes: ₹10,000 each',
                rules: 'Teams of 1-2 members. Original code only. 48-hour development window. Final presentation required. Judging based on innovation, technical implementation, and presentation.'
            });

            await sampleHackathon.save();
            console.log('✅ Sample hackathon created');
        }

        console.log('🎉 Production database setup completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Production setup failed:', error);
        process.exit(1);
    }
}

setupProductionDatabase();