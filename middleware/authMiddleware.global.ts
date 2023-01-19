import Cookies from 'js-cookie';

export default defineNuxtRouteMiddleware((to, from) => {
  // console.debug('middleware/authMiddleware/to', to); //DELETE
  // console.debug('middleware/authMiddleware/from', from); //DELETE

  // console.debug('middleware/authMiddleware/Cookies', Cookies); //DELETE
  // console.debug('middleware/authMiddleware/Cookies/get', Cookies.get()); //DELETE

  const token: UserToken = Cookies.get('token') || ''; //FIXME: must be taked from @/services/credentials/credentialsService/getToken

  // console.debug('middleware/authMiddleware/cookie/token', token); //DELETE

  if (token) {
    // console.debug('middleware/authMiddleware/have-token'); //DELETE

    if (to.name === 'signin') {
      return navigateTo('/');
    }
  } else {
    // console.debug('middleware/authMiddleware/dont-have-token'); //DELETE

    if (to.name !== 'signin') {
      return navigateTo('/signin');
    }
  }
});