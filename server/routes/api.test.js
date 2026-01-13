import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';


await jest.unstable_mockModule('../oAuthModel.js', () => ({
  default: jest.fn(),
}));


const { default: OAuthModel } = await import('../oAuthModel.js');
const { default: router } = await import('./api.js');


describe('GET /home', () => {
  let app;
  let mockDb;

  beforeEach(() => {
    app = express();
    mockDb = {};

    app.set('db', mockDb);
    app.use('/', router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns user data when token is valid', async () => {
    const mockUser = {
      _id: { toString: () => 'user123' },
      first_name: 'John',
      family_name: 'Doe',
      height: 180,
      weight: 80,
      age: 35,
      drinks: [
        {
          name: 'Mojito',
          timestamp: 123456789,
          ingredients: [{ volume: 50, unit: 'ml', abv: 40 }],
        },
      ],
    };

    OAuthModel.mockImplementation(() => ({
      getAccessToken: jest.fn().mockResolvedValue({ user: mockUser }),
    }));

    const res = await request(app)
      .get('/home')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(200);
    expect(res.body.id).toBe('user123');
  });

  test('returns 401 when authorization header is missing', async () => {
    const res = await request(app).get('/home');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'UNAUTHORIZED' });
  });

  test('returns 401 when token is invalid', async () => {
    OAuthModel.mockImplementation(() => ({
      getAccessToken: jest.fn().mockResolvedValue(null),
    }));

    const res = await request(app)
      .get('/home')
      .set('Authorization', 'Bearer invalid-token');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'INVALID_TOKEN' });
  });

  test('returns 500 on unexpected error', async () => {
    OAuthModel.mockImplementation(() => {
      throw new Error('DB failure');
    });

    const res = await request(app)
      .get('/home')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'INTERNAL_SERVER_ERROR' });
  });
});

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('POST /profile/drink', () => {
  let app;
  let mockDb;
  let mockCollection;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    mockCollection = {
      updateOne: jest.fn().mockResolvedValue({ acknowledged: true }),
    };

    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };

    app.set('db', mockDb);
    app.use('/', router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('adds a drink when token and input are valid', async () => {
    const mockUser = {
      _id: '507f1f77bcf86cd799439011',
    };

    OAuthModel.mockImplementation(() => ({
      getAccessToken: jest.fn().mockResolvedValue({ user: mockUser }),
    }));

    const res = await request(app)
      .post('/profile/drink')
      .set('Authorization', 'Bearer valid-token')
      .send({
        name: 'Old Fashioned',
        ingredients: [
          { volume: 50, unit: 'ml', abv: 40 },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });
    expect(mockCollection.updateOne).toHaveBeenCalledTimes(1);
  });

  test('returns 401 when authorization header is missing', async () => {
    const res = await request(app)
      .post('/profile/drink')
      .send({
        name: 'Negroni',
        ingredients: [{ volume: 30, unit: 'ml', abv: 45 }],
      });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'UNAUTHORIZED' });
  });

  test('returns 401 when token is invalid', async () => {
    OAuthModel.mockImplementation(() => ({
      getAccessToken: jest.fn().mockResolvedValue(null),
    }));

    const res = await request(app)
      .post('/profile/drink')
      .set('Authorization', 'Bearer invalid-token')
      .send({
        name: 'Negroni',
        ingredients: [{ volume: 30, unit: 'ml', abv: 45 }],
      });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'INVALID_TOKEN' });
  });

  test('returns 400 when input is invalid', async () => {
    OAuthModel.mockImplementation(() => ({
      getAccessToken: jest.fn().mockResolvedValue({ user: { _id: 'user123' } }),
    }));

    const res = await request(app)
      .post('/profile/drink')
      .set('Authorization', 'Bearer valid-token')
      .send({
        name: 123,
        ingredients: 'not-an-array',
      });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'INVALID_INPUT' });
    expect(mockCollection.updateOne).not.toHaveBeenCalled();
  });

  test('returns 500 on unexpected error', async () => {
    OAuthModel.mockImplementation(() => {
      throw new Error('Unexpected failure');
    });

    const res = await request(app)
      .post('/profile/drink')
      .set('Authorization', 'Bearer valid-token')
      .send({
        name: 'Martini',
        ingredients: [{ volume: 60, unit: 'ml', abv: 40 }],
      });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'INTERNAL_SERVER_ERROR' });
  });
});

afterAll(() => {
  console.error.mockRestore();
});