import axios from "axios";

export default defineNuxtPlugin(nuxtApp => {
  const defaultUrl = "<https://localhost:5001>";

  const api = axios.create({
    baseURL: defaultUrl,
    headers: {
      common: {},
    },
  });

  // nuxtApp.vueApp.use(api);

  return {
    provide: {
      api,
    },
  };
});