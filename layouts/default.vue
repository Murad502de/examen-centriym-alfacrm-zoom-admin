<template lang="pug">
v-app
  v-btn.layout-default__logout(
    v-if="$route.name !== 'signin'",
    icon,
    elevation="1",
    height="48",
    width="48",
    @click="signout"
  )
    v-icon(color="#607d8b") mdi-logout
  .layout-default__main
    slot
</template>

<script>
import { mapActions } from "pinia";
import { useUserStore } from "@/store/UserStore";

export default {
  components: {},

  props: {},
  data: () => ({
    signoutDialog: false,
  }),
  computed: {},

  watch: {},
  methods: {
    /* STORE */
    ...mapActions(useUserStore, { signoutStore: "signout" }),

    /* GETTERS */
    /* SETTERS */
    /* HANDLERS */
    async signout() {
      // console.debug("layout/default/methods/signout"); //DELETE

      await this.signoutStore();
      this.$router.push({ name: "signin" });
    },

    /* HELPERS */
    /* ACTIONS */
  },

  created() {
    // console.debug("layout/default/created", this.$route.name); //DELETE
  },
  mounted() {
    // console.debug("layout/default/mounted"); //DELETE
  },
};
</script>

<style lang="scss">
.layout-default {
  &__logout {
    position: fixed;
    top: 12px;
    right: 24px;
  }
  &__main {
    margin-top: 48px;
    width: 100%;
    height: 100%;
  }
}
</style>