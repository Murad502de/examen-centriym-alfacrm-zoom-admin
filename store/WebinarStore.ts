import { defineStore } from 'pinia';
import { Webinar } from '@/domain/Webinar';

interface State {
  webinar: Webinar | null;
  webinarList: Array<Webinar>;
}

export const useWebinarStore = defineStore('WebinarStore', {
  state: (): State => {
    return {
      webinar: null,
      webinarList: [],
    }
  },

  getters: {
    webinar: (state): Webinar | null => {
      // console.debug('store/WebinarStore/webinar'); //DELETE

      return state.webinar;
    },
    webinarList: (state): Array<Webinar> => {
      // console.debug('store/WebinarStore/webinarList'); //DELETE

      return state.webinarList;
    },
  },
  actions: {},
})