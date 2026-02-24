import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { AppDataSource } from './config/data-source';
import { User, UserRole } from './entities/User';
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  }),
);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', dashboardRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const seedAdminUser = async () => {
  const userRepository = AppDataSource.getRepository(User);
  const adminEmail = 'admin@hostel.com';

  const existingAdmin = await userRepository.findOne({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    return;
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = userRepository.create({
    name: 'Default Admin',
    email: adminEmail,
    password: hashedPassword,
    role: UserRole.ADMIN,
  });

  await userRepository.save(admin);
  console.log('Seeded default admin user: admin@hostel.com / admin123');
};

AppDataSource.initialize()
  .then(async () => {
    await seedAdminUser();
    app.listen(port, () => {
      console.log(`Backend server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize datasource:', err);
    process.exit(1);
  });
