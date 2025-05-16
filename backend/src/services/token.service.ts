import jwt from 'jsonwebtoken';

class TokenService {
  private secretKey: string;

  constructor() {
    this.secretKey = process.env.SECRET_STR || '';
  }

  public signToken(id: string): string {
    if (!this.secretKey) {
      throw new Error('Secret key is not defined');
    }

    return jwt.sign({ id }, this.secretKey, { expiresIn: '1d' });
  }
}

export default TokenService;
