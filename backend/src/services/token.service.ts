import jwt from 'jsonwebtoken';

class TokenService {
  private readonly JWT_SECRET: string;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  }

  public signToken(userId: string): string {
    return jwt.sign({ id: userId }, this.JWT_SECRET, {
      expiresIn: '24h'
    });
  }

  public verifyToken(token: string): { id: string } | null {
    try {
      return jwt.verify(token, this.JWT_SECRET) as { id: string };
    } catch (error) {
      return null;
    }
  }
}

export default TokenService;
