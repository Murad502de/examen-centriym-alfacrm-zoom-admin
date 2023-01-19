import { api } from '@/api';
import { User } from '@/domain/User';

interface Error {
  response?: any;
};
interface Response {
  status: StatusCode,
  user: User;
};

let error: Error = {};

export const signinService = async (email: Email, password: Password): Promise<Response> => {
  // console.debug('services/auth/signinService/email', email); //DELETE
  // console.debug('services/auth/signinService/password', password); //DELETE

  try {
    const response = await api.post('auth/signin', {
      email,
      password,
    });

    // console.debug('services/auth/signinService/response', response); //DELETE

    const out: Response = {
      status: response.status,
      user: response.data,
    };

    return out;
  } catch (e) {
    return Object.assign(error, e).response;
  }
};