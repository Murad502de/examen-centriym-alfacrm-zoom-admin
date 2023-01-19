import { User } from '@/domain/User';
import Cookies from 'js-cookie';

const { APP_BASE_URL } = useRuntimeConfig();
const CookiesWithAttributes = Cookies.withAttributes({ path: APP_BASE_URL });

console.debug('CookiesWithAttributes', CookiesWithAttributes); //DELETE
console.debug('Cookies', Cookies); //DELETE

console.debug('CookiesWithAttributes/get', CookiesWithAttributes.get()); //DELETE
console.debug('Cookies/get', Cookies.get()); //DELETE

console.debug('CookiesWithAttributes/get/token', CookiesWithAttributes.get('token')); //DELETE
console.debug('Cookies/get/token', Cookies.get('token')); //DELETE


export const setCredentials = (user: User): void => {
  CookiesWithAttributes.set('uuid', user.uuid);
  CookiesWithAttributes.set('token', user.token);
};
export const resetCredentials = (): void => {
  setCredentials({
    uuid: '',
    token: '',
  });
};
export const getCredentials = (): User => ({
  uuid: getUuid(),
  token: getToken(),
});

export const getUuid = () => (CookiesWithAttributes.get('uuid') || '');
export const getToken = (): UserToken  => (CookiesWithAttributes.get('token') || '');