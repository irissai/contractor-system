const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
console.log('Resolved path for Users model:', require.resolve('../models/User.js'));

const router = express.Router();
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1]; // Bearer tokenString

  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, username, role, iat, exp }
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}


// ✅ Register
function toISODate(dmy) {
  const [day, month, year] = dmy.split(/[-\/]/);
  return new Date(`${year}-${month}-${day}`);
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Malformed token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = userData; // userId, username, role จาก token payload
    next();
  });
};

router.get('/projects', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.projects || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get projects', details: err.message });
  }
});



router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('-password'); // ตัด password ออก
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const {
      username,
      password,
      role,
      projectName,
      plotNumber,
      contractStart,
      contractEnd,
      houseDetail,
      mainContractor
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // แปลงวันที่ก่อนบันทึก (ถ้ามีค่า)
    const startDate = contractStart ? toISODate(contractStart) : null;
    const endDate = contractEnd ? toISODate(contractEnd) : null;

    const newUser = new User({
      username,
      password: hashedPassword,
      role,
      projectName,
      plotNumber,
      contractStart: startDate,
      contractEnd: endDate,
      houseDetail,
      mainContractor
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Registration failed', details: err.message });
  }
});



// ✅ Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

module.exports = router;
