import { api } from '@/api';
import { Webinar } from '@/domain/Webinar';

interface Error {
  response?: any;
};
interface Response {
  status: StatusCode,
  webinars: Webinar;
};

let error: Error = {};

export const fetchWebinars = async (): Promise<Response> => {
  // console.debug('api/webinar/webinars/fetchWebinars'); //DELETE

  try {
    const response = await api.get('webinars');

    // console.debug('api/webinar/webinars/fetchWebinars/response', response); //DELETE

    const out: Response = {
      status: response.status,
      webinars: response.data,
    };

    return out;
  } catch (e) {
    return Object.assign(error, e).response;
  }
};