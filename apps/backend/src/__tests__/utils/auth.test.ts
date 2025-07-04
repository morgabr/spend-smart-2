import { jest } from '@jest/globals';
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  isValidEmail,
  validatePassword,
  verifyAccessToken,
  verifyRefreshToken,
} from '../../utils/auth';
import { mockBcrypt } from '../setup';

const mockJWT = {
  sign: jest.fn(),
  verify: jest.fn(),
};

jest.mock('jsonwebtoken', () => mockJWT);

describe('Auth Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateAccessToken', () => {
    it('should generate an access token', () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'USER',
      };

      const expectedToken = 'access-token-string';

      mockJWT.sign.mockReturnValue(expectedToken);

      const token = generateAccessToken(payload);

      expect(mockJWT.sign).toHaveBeenCalledWith(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );
      expect(token).toBe(expectedToken);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a refresh token', () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'USER',
      };

      const expectedToken = 'refresh-token-string';

      mockJWT.sign.mockReturnValue(expectedToken);

      const token = generateRefreshToken(payload);

      expect(mockJWT.sign).toHaveBeenCalledWith(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      expect(token).toBe(expectedToken);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify and return token payload', () => {
      const token = 'valid-token';
      const expectedPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'USER',
      };

      mockJWT.verify.mockReturnValue(expectedPayload);

      const payload = verifyAccessToken(token);

      expect(mockJWT.verify).toHaveBeenCalledWith(
        token,
        process.env.JWT_SECRET
      );
      expect(payload).toEqual(expectedPayload);
    });

    it('should return null for invalid token', () => {
      const token = 'invalid-token';

      mockJWT.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const payload = verifyAccessToken(token);

      expect(payload).toBeNull();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify and return token payload', () => {
      const token = 'valid-refresh-token';
      const expectedPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'USER',
      };

      mockJWT.verify.mockReturnValue(expectedPayload);

      const payload = verifyRefreshToken(token);

      expect(mockJWT.verify).toHaveBeenCalledWith(
        token,
        process.env.JWT_SECRET
      );
      expect(payload).toEqual(expectedPayload);
    });

    it('should return null for invalid token', () => {
      const token = 'invalid-refresh-token';

      mockJWT.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const payload = verifyRefreshToken(token);

      expect(payload).toBeNull();
    });
  });

  describe('hashPassword', () => {
    it('should hash password successfully', async () => {
      const password = 'mySecurePassword123!';
      const hashedPassword = 'hashed-password';

      (mockBcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await hashPassword(password);

      expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 12);
      expect(result).toBe(hashedPassword);
    });

    it('should throw error when hashing fails', async () => {
      const password = 'mySecurePassword123!';
      const error = new Error('Hashing failed');

      (mockBcrypt.hash as jest.Mock).mockRejectedValue(error);

      await expect(hashPassword(password)).rejects.toThrow('Hashing failed');
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching passwords', async () => {
      const password = 'mySecurePassword123!';
      const hashedPassword = 'hashed-password';

      (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await comparePassword(password, hashedPassword);

      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      const password = 'mySecurePassword123!';
      const hashedPassword = 'hashed-password';

      (mockBcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await comparePassword(password, hashedPassword);

      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(false);
    });

    it('should throw error when comparison fails', async () => {
      const password = 'mySecurePassword123!';
      const hashedPassword = 'hashed-password';
      const error = new Error('Comparison failed');

      (mockBcrypt.compare as jest.Mock).mockRejectedValue(error);

      await expect(comparePassword(password, hashedPassword)).rejects.toThrow(
        'Comparison failed'
      );
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid passwords', () => {
      const validPasswords = [
        'Password123!',
        'MySecure123@',
        'Test1234#',
        'Valid123$',
      ];

      validPasswords.forEach(password => {
        expect(validatePassword(password)).toBe(true);
      });
    });

    it('should return false for invalid passwords', () => {
      const invalidPasswords = [
        'short', // Too short
        'nouppercase123!', // No uppercase
        'NOLOWERCASE123!', // No lowercase
        'NoNumbers!', // No numbers
        'NoSpecial123', // No special characters
        'password', // Too simple
        '', // Empty
      ];

      invalidPasswords.forEach(password => {
        expect(validatePassword(password)).toBe(false);
      });
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'email+tag@gmail.com',
        'user123@test-domain.org',
      ];

      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    it('should return false for invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user@@domain.com',
        'user@domain',
        '',
        'user.domain.com',
      ];

      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false);
      });
    });
  });
});
