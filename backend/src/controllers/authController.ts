import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  Matches,
  MinLength,
  validate,
} from 'class-validator';
import { AppDataSource } from '../config/data-source';
import { User, UserRole } from '../entities/User';

class RegisterDTO {
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;

  @Matches(/^[0-9]{10,15}$/)
  phoneNumber!: string;

  @IsNotEmpty()
  address!: string;

  @IsDateString()
  dateOfBirth!: string;
}

class LoginDTO {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}

const sanitizeUser = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phoneNumber: user.phoneNumber,
  address: user.address,
  dateOfBirth: user.dateOfBirth,
  role: user.role,
  createdAt: user.createdAt,
});

export const register = async (req: Request, res: Response) => {
  const dto = Object.assign(new RegisterDTO(), req.body);
  const errors = await validate(dto);

  if (errors.length) {
    return res.status(400).json({ message: 'Invalid input', errors });
  }

  const userRepository = AppDataSource.getRepository(User);

  const existing = await userRepository.findOne({ where: { email: dto.email } });
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const birthDate = new Date(dto.dateOfBirth);
  const today = new Date();
  if (Number.isNaN(birthDate.getTime()) || birthDate > today) {
    return res.status(400).json({ message: 'Invalid date of birth' });
  }

  const hashedPassword = await bcrypt.hash(dto.password, 10);

  const user = userRepository.create({
    name: dto.name,
    email: dto.email,
    password: hashedPassword,
    phoneNumber: dto.phoneNumber,
    address: dto.address,
    dateOfBirth: dto.dateOfBirth,
    role: UserRole.STUDENT,
  });

  await userRepository.save(user);

  return res.status(201).json({
    message: 'Student registered successfully',
    user: sanitizeUser(user),
  });
};

export const login = async (req: Request, res: Response) => {
  const dto = Object.assign(new LoginDTO(), req.body);
  const errors = await validate(dto);

  if (errors.length) {
    return res.status(400).json({ message: 'Invalid input', errors });
  }

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { email: dto.email } });

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(dto.password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (user.role !== dto.role) {
    return res
      .status(403)
      .json({ message: `Access denied for ${dto.role} portal` });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: 'JWT secret not configured' });
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    secret,
    { expiresIn: '1d' },
  );

  return res.json({
    token,
    user: sanitizeUser(user),
  });
};
