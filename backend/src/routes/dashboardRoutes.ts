import { Router } from 'express';
import { UserRole } from '../entities/User';
import { authorizeRoles, verifyJWT } from '../middleware/authMiddleware';

const router = Router();

router.get(
  '/admin/dashboard',
  verifyJWT,
  authorizeRoles(UserRole.ADMIN),
  (req, res) => {
    res.json({
      message: 'Welcome to Admin Dashboard',
      userId: req?.user?.id,
      role: req?.user?.role,
    });
  },
);

router.get(
  '/student/dashboard',
  verifyJWT,
  authorizeRoles(UserRole.STUDENT),
  (req, res) => {
    res.json({
      message: 'Welcome to Student Dashboard',
      userId: req.user?.id,
      role: req.user?.role,
    });
  },
);

export default router;
