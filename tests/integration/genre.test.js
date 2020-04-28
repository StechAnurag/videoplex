const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');

let server;

describe('/api/v1/genres', () => {
  // start and close the server each time before and after the tests
  beforeEach(() => {
    server = require('../../index');
  });

  afterEach(async () => {
    server.close();
    await Genre.deleteMany({});
  });

  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.insertMany([{ name: 'genre1' }, { name: 'genre2' }]);

      const res = await request(server).get('/api/v1/genres');
      expect(res.status).toBe(200);
      expect(res.body.data.genres.length).toBe(2);
      expect(res.body.data.genres.some(g => g.name === 'genre1')).toBeTruthy();
      expect(res.body.data.genres.some(g => g.name === 'genre2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return a genre if valid id is passed', async () => {
      const genre = new Genre({ name: 'genre1' });
      await genre.save();
      const res = await request(server).get('/api/v1/genres/' + genre._id);
      expect(res.status).toBe(200);
      expect(res.body.data.genre).toHaveProperty('name', 'genre1');
    });

    it('should return a 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/v1/genres/1');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {
    it('should return a 401 if client is not logged in', async () => {
      const res = await request(server).post('/api/v1/genres').send({ name: 'genre1' });
      expect(res.status).toBe(401);
    });

    it('should return a 400 if genre is less than 3 characters', async () => {
      const token = new User().generateToken();

      const res = await request(server)
        .post('/api/v1/genres')
        .set('x-auth-token', token)
        .send({ name: 'ab' });

      expect(res.status).toBe(400);
    });

    it('should return a 400 if genre is more than 40 characters', async () => {
      const token = new User().generateToken();

      const name = new Array(50).fill('a').join();
      const res = await request(server)
        .post('/api/v1/genres')
        .set('x-auth-token', token)
        .send({ name });

      expect(res.status).toBe(400);
    });

    it('should save the genre if it is valid', async () => {
      const token = new User().generateToken();

      const name = 'Happy';
      const res = await request(server)
        .post('/api/v1/genres')
        .set('x-auth-token', token)
        .send({ name });

      const genre = await Genre.find({ name });
      expect(genre).not.toBeNull();
    });

    it('should retrun the genre if it is valid', async () => {
      const token = new User().generateToken();

      const name = 'Happy';
      const res = await request(server)
        .post('/api/v1/genres')
        .set('x-auth-token', token)
        .send({ name });

      expect(res.body.data.genre).toHaveProperty('_id');
      expect(res.body.data.genre).toHaveProperty('name', name);
    });
  });
});
