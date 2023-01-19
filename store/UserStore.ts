import { defineStore } from 'pinia';
import { User } from '@/domain/User';
import { getCredentials, setCredentials, resetCredentials, } from '@/services/credentials/credentialsService';

interface State {
  user: User | null;
}

export const useUserStore = defineStore('UserStore', {
  state: (): State => ({
    user: getCredentials()
  }),

  getters: {
    my: (state): User | any => {
      // console.debug('store/UserStore/my'); //DELETE

      return state.user;
    },
  },

  actions: {
    async signin(user: User) {
      // console.debug('store/UserStore/signin/user', user); //DELETE

      this.user = user;

      setCredentials(user);
    },
    async signout() {
      // console.debug('store/UserStore/signout'); //DELETE

      this.user = {
        uuid: '',
        token: '',
      };

      resetCredentials();
    },
  },
});