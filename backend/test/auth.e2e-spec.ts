import { CreateUserDto } from 'src/users/users.dto';
import request from 'supertest';
import { APP_URL } from './utils/constants';
import {
  duplicateErrorExpect,
  keysExpect,
  validationFailedExpect,
} from './utils/expects';

let headerContent: any;
const email = 'dani.lesmiadi@gmail.com';
const keys = 'id name email createdAt updatedAt';
const registerData: CreateUserDto = {
  name: 'Test User',
  email: 'test@test.com',
  password: 'password',
};
describe('Auth', () => {
  it('cannot register if validation failed', () => {
    return request(APP_URL)
      .post('/register')
      .expect(({ body }) => {
        validationFailedExpect(body, 'name should not be empty');
      });
  });
  it('can register', () => {
    return request(APP_URL)
      .post('/register')
      .send(registerData)
      .expect(({ body }) => {
        const postData = { ...registerData };
        delete postData['password'];
        Object.keys(postData).map((key: keyof CreateUserDto) => {
          expect(body[key]).toEqual(postData[key]);
        });
        keysExpect(body, keys);
      });
  });

  it('cannot register if duplicate', () => {
    return request(APP_URL)
      .post('/register')
      .send(registerData)
      .expect(({ body }) => {
        duplicateErrorExpect(body, 'email');
      });
  });

  it('cannot login if no email and password', () => {
    return request(APP_URL)
      .post('/login')
      .expect(401)
      .expect(({ body }) => {
        expect(body.message).toEqual('Unauthorized');
      });
  });
  it('can login', () => {
    return request(APP_URL)
      .post('/login')
      .send({
        email,
        password: 'password',
      })
      .expect(200)
      .expect(({ header }) => {
        headerContent = header;
        expect(header['set-cookie']).toBeDefined();
      });
  });

  it('can get me after login', () => {
    return request(APP_URL)
      .get('/me')
      .set('Cookie', [...headerContent['set-cookie']])
      .expect(200)
      .expect(({ body }) => {
        expect(body.email).toEqual(email);
      });
  });

  it('can logout', () => {
    return request(APP_URL)
      .post('/logout')
      .set('Cookie', [...headerContent['set-cookie']])
      .expect(200)
      .expect(({ body, header }) => {
        expect(body.message).toEqual('Logout succeed');
        expect(header['set-cookie']).toEqual([
          'Authentication=; HttpOnly; Path=/; Max-Age=0',
        ]);
      });
  });
});
