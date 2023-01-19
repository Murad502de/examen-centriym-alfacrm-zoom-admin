import { api } from '@/api';
import { Gift } from '@/domain/Gift';

interface Error {
  response?: any;
};
interface CreateResponse {
  status: StatusCode,
  webinarUuid: string;
};
interface FetchResponse {
  status: StatusCode,
  webinar: Gift;
};
interface Response {
  status: StatusCode,
};

let error: Error = {};

export const createGift = async (
  webinar_uuid: string,
  name: string,
  number: number,
  delay: number,
  link: string
): Promise<CreateResponse> => {
  // console.debug('api/webinar/webinars/deleteGift/webinar_uuid', webinar_uuid); //DELETE
  // console.debug('api/webinar/webinars/deleteGift/name', name); //DELETE
  // console.debug('api/webinar/webinars/deleteGift/number', number); //DELETE
  // console.debug('api/webinar/webinars/deleteGift/delay', delay); //DELETE
  // console.debug('api/webinar/webinars/deleteGift/link', link); //DELETE

  try {
    const response = await api.post(`gifts`, { webinar_uuid, name, number, delay, link, });

    // console.debug('api/webinar/webinars/deleteGift/response', response); //DELETE

    const out: CreateResponse = {
      status: response.status,
      webinarUuid: response.data,
    };

    return out;
  } catch (e) {
    return Object.assign(error, e).response;
  }
};
export const fetchGiftDetail = () => {
  // console.debug('api/gift/fetchGiftDetail'); //DELETE
};
export const updateGift = async (
  uuid: string,
  name: string,
  number: number,
  delay: number,
  link: string
): Promise<Response> => {
  // console.debug('api/webinar/webinars/updateGift/uuid', uuid); //DELETE
  // console.debug('api/webinar/webinars/updateGift/name', name); //DELETE
  // console.debug('api/webinar/webinars/updateGift/number', number); //DELETE
  // console.debug('api/webinar/webinars/updateGift/delay', delay); //DELETE
  // console.debug('api/webinar/webinars/updateGift/link', link); //DELETE

  try {
    const response = await api.put(`gifts/${uuid}`, { name, number, delay, link, });

    // console.debug('api/webinar/webinars/updateGift/response', response); //DELETE

    const out: Response = {
      status: response.status,
    };

    return out;
  } catch (e) {
    return Object.assign(error, e).response;
  }
};
export const deleteGift = async (uuid: string): Promise<Response> => {
  // console.debug('api/webinar/webinars/deleteGift/name', uuid); //DELETE

  try {
    const response = await api.delete(`gifts/${uuid}`,);

    // console.debug('api/webinar/webinars/deleteGift/response', response); //DELETE

    const out: Response = {
      status: response.status,
    };

    return out;
  } catch (e) {
    return Object.assign(error, e).response;
  }
};