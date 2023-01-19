import { api } from '@/api';
import { Webinar } from '@/domain/Webinar';

interface Error {
  response?: any;
};
interface CreateResponse {
  status: StatusCode,
  webinarUuid: string;
};
interface FetchResponse {
  status: StatusCode,
  webinar: Webinar;
};
interface Response {
  status: StatusCode,
};

let error: Error = {};

export const createWebinar = async (name: string, code: string): Promise<CreateResponse> => {
  // console.debug('api/webinar/webinars/deleteWebinar/name', name); //DELETE
  // console.debug('api/webinar/webinars/deleteWebinar/code', code); //DELETE

  try {
    const response = await api.post(`webinars`, { name, code, });

    // console.debug('api/webinar/webinars/deleteWebinar/response', response); //DELETE

    const out: CreateResponse = {
      status: response.status,
      webinarUuid: response.data,
    };

    return out;
  } catch (e) {
    return Object.assign(error, e).response;
  }
};
export const fetchWebinarDetail = async (uuid: string): Promise<FetchResponse> => {
  // console.debug('api/webinar/webinars/fetchWebinarDetail', uuid); //DELETE

  try {
    const response = await api.get(`webinars/${uuid}`);

    // console.debug('api/webinar/webinars/fetchWebinarDetail/response', response); //DELETE

    const out: FetchResponse = {
      status: response.status,
      webinar: response.data,
    };

    return out;
  } catch (e) {
    return Object.assign(error, e).response;
  }
};
export const updateWebinar = async (uuid: string, name: string, code: string): Promise<Response> => {
  // console.debug('api/webinar/webinars/deleteWebinar/uuid', uuid); //DELETE
  // console.debug('api/webinar/webinars/deleteWebinar/name', name); //DELETE
  // console.debug('api/webinar/webinars/deleteWebinar/code', code); //DELETE

  try {
    const response = await api.put(`webinars/${uuid}`, { name, code, });

    // console.debug('api/webinar/webinars/deleteWebinar/response', response); //DELETE

    const out: Response = {
      status: response.status,
    };

    return out;
  } catch (e) {
    return Object.assign(error, e).response;
  }
};
export const deleteWebinar = async (uuid: string): Promise<Response> => {
  // console.debug('api/webinar/webinars/deleteWebinar', uuid); //DELETE

  try {
    const response = await api.delete(`webinars/${uuid}`);

    // console.debug('api/webinar/webinars/deleteWebinar/response', response); //DELETE

    const out: Response = {
      status: response.status,
    };

    return out;
  } catch (e) {
    return Object.assign(error, e).response;
  }
};