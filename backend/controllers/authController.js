import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import asyncHandler from '../utils/asyncHandler.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper: Generate Access Token (short-lived, 15m)
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
};

// Helper: Generate Refresh Token (long-lived, 7d)
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

// Helper: Set Refresh Token Cookie
const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
  });
};

// Helper: Format user response to return flat string URL for avatar and clean fields
const formatUserResponse = (user) => {
  let avatarUrl = '';
  if (user.avatar) {
    if (typeof user.avatar === 'string') {
      avatarUrl = user.avatar;
    } else if (typeof user.avatar === 'object') {
      avatarUrl = user.avatar.url || '';
    }
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: avatarUrl,
    role: user.role,
    communityScore: user.communityScore,
    preferences: user.preferences
  };
};

// ── Register User ────────────────────────────────────────────────────────────
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists.');
  }

  const user = await User.create({
    name,
    email,
    password,
    provider: 'local',
    role: 'user'
  });

  const accessToken = generateAccessToken(user);
  const refreshTokenVal = generateRefreshToken(user);

  // Store refresh token
  try {
    await RefreshToken.create({
      user: user._id,
      token: refreshTokenVal,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
  } catch (err) {
    if (err.code !== 11000) throw err;
  }

  setRefreshTokenCookie(res, refreshTokenVal);

  res.status(201).json({
    token: accessToken,
    user: formatUserResponse(user)
  });
});

// ── Login User ───────────────────────────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password.');
  }

  const accessToken = generateAccessToken(user);
  const refreshTokenVal = generateRefreshToken(user);

  // Store refresh token
  try {
    await RefreshToken.create({
      user: user._id,
      token: refreshTokenVal,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
  } catch (err) {
    if (err.code !== 11000) throw err;
  }

  setRefreshTokenCookie(res, refreshTokenVal);

  res.status(200).json({
    token: accessToken,
    user: formatUserResponse(user)
  });
});

// ── Google OAuth Sign In ─────────────────────────────────────────────────────
export const googleAuth = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    res.status(400);
    throw new Error('Google credential token is required.');
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    payload = ticket.getPayload();
  } catch (err) {
    // Development Bypass/Fallback:
    if (process.env.NODE_ENV === 'development') {
      const mockEmail = credential.includes('@') ? credential : 'google.user@gmail.com';
      payload = {
        email: mockEmail,
        name: mockEmail.split('@')[0],
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
        sub: 'mock-google-id-' + mockEmail
      };
    } else {
      res.status(401);
      throw new Error('Google OAuth verification failed: ' + err.message);
    }
  }

  const { name, email, picture, sub: googleId } = payload;

  let user = await User.findOne({ email });

  if (user) {
    // Account Linking: If user registered via local, upgrade to support Google Login
    if (user.provider === 'local') {
      user.provider = 'google';
      user.googleId = googleId;
      if (!user.avatar) user.avatar = picture || '';
      await user.save();
    }
  } else {
    // Create new Google User
    user = await User.create({
      name,
      email,
      provider: 'google',
      googleId,
      avatar: picture || '',
      role: 'user'
    });
  }

  const accessToken = generateAccessToken(user);
  const refreshTokenVal = generateRefreshToken(user);

  await RefreshToken.create({
    user: user._id,
    token: refreshTokenVal,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  setRefreshTokenCookie(res, refreshTokenVal);

  res.status(200).json({
    token: accessToken,
    user: formatUserResponse(user)
  });
});

// ── Refresh Token Rotation ───────────────────────────────────────────────────
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    res.status(401);
    throw new Error('No refresh token provided.');
  }

  // Clear the old cookie immediately to enable rotation
  res.clearCookie('refreshToken');

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    // If token is invalid or expired, search and remove from DB if it exists
    await RefreshToken.deleteOne({ token });
    res.status(401);
    throw new Error('Invalid or expired refresh token.');
  }

  // Find token record in database
  const tokenRecord = await RefreshToken.findOne({ token });
  
  // Reuse Detection: If refresh token has already been marked as used
  if (tokenRecord && tokenRecord.isUsed) {
    // Invalidate ALL tokens for the breached user account
    await RefreshToken.deleteMany({ user: decoded.id });
    res.status(403);
    throw new Error('Breach detected: Refresh token reuse. All sessions terminated.');
  }

  if (!tokenRecord) {
    res.status(401);
    throw new Error('Refresh token not recognized.');
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    res.status(401);
    throw new Error('User not found.');
  }

  // Mark the current token as used (invalidation)
  tokenRecord.isUsed = true;
  await tokenRecord.save();

  // Generate new rotated access and refresh tokens
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  // Write new refresh token to DB
  await RefreshToken.create({
    user: user._id,
    token: newRefreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  setRefreshTokenCookie(res, newRefreshToken);

  res.status(200).json({
    token: newAccessToken
  });
});

// ── Logout User ──────────────────────────────────────────────────────────────
export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    // Delete/invalidate refresh token record
    await RefreshToken.deleteOne({ token });
  }

  // Clear HTTP cookie
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logged out successfully.' });
});

// ── Get Current Profile ──────────────────────────────────────────────────────
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    user: formatUserResponse(req.user)
  });
});

// ── Update Preferences ───────────────────────────────────────────────────────
export const updatePreferences = asyncHandler(async (req, res) => {
  const { gender, favoriteOccasions, favoriteColors, favoriteStyles } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  user.preferences = {
    gender: gender || user.preferences.gender,
    favoriteOccasions: favoriteOccasions || user.preferences.favoriteOccasions,
    favoriteColors: favoriteColors || user.preferences.favoriteColors,
    favoriteStyles: favoriteStyles || user.preferences.favoriteStyles
  };

  await user.save();

  res.status(200).json({
    user: formatUserResponse(user)
  });
});
