<template lang="pug">
.signin-page
  v-card.mx-auto(width="400", elevation="7")
    v-list-item(two-line)
      v-list-item-title.text-h5(align="center") Авторизация

    v-list-item
      v-form.signin-page__form(ref="form", v-model="valid", lazy-validation)
        v-text-field.signin-page__form-input(
          v-model="email",
          :rules="emailRules",
          label="E-mail",
          required,
          variant="outlined",
          color="blue"
        )

        v-text-field.signin-page__form-input(
          v-model="password",
          :rules="passwordRules",
          label="Пароль",
          required,
          variant="outlined",
          type="password",
          color="blue"
        )

      .signin-page__form-button
        v-btn.mr-4(
          :disabled="!valid",
          :loading="loading",
          color="blue",
          width="280",
          height="48",
          @click="signin"
        ) Войти

  v-dialog.signin-page__auth-dialog--error(
    v-model="errorAuthDialog",
    transition="dialog-top-transition",
    max-width="500"
  )
    v-card
      v-card-title.text-h5.signin-page__auth-dialog--error-title Ошибка
      v-card-text К сожалению, произошла ошибка, при аутентификации в системе. Пожалуйста, проверьте корректность введённых данных аутентификации.
</template>

<script>
import { mapState } from "pinia";
import { mapActions } from "pinia";
import { useUserStore } from "@/store/UserStore";
import { signinService } from "@/services/auth/signinService";

export default {
  components: {},

  props: {},
  data() {
    return {
      errorAuthDialog: false,
      valid: true,
      loading: false,
      password: "",
      passwordRules: [(v) => !!v || "Обязательно к заполненнию"],
      email: "",
      emailRules: [
        (v) => !!v || "Обязательно к заполненнию",
        (v) => /.+@.+\..+/.test(v) || "Неверный формат электронной почты",
      ],
      select: null,
      items: ["Item 1", "Item 2", "Item 3", "Item 4"],
      checkbox: false,
    };
  },
  computed: {
    ...mapState(useUserStore, {
      user: "my",
    }),
  },

  watch: {},
  methods: {
    /* STORE */
    ...mapActions(useUserStore, { signinStore: "signin" }),

    /* GETTERS */
    /* SETTERS */
    /* HANDLERS */
    async signin() {
      // console.debug("pages/signin/methods/signin"); //DELETE

      this.loading = true;
      const response = await signinService(this.email, this.password);

      // console.debug("pages/signin/methods/signin/response", response); //DELETE
      // console.debug(
      //   "pages/signin/methods/signin/response/status",
      //   response.status
      // ); //DELETE

      if (response.status !== 200) {
        // console.debug("pages/signin/methods/signin/error"); //DELETE

        this.loading = false;
        this.errorAuthDialog = true;

        return;
      }

      // console.debug("pages/signin/methods/signin/success", response); //DELETE

      await this.signinStore(response.user);

      this.loading = false;

      this.$router.push({ name: "index" });
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },

    /* HELPERS */
    /* ACTIONS */
  },

  created() {
    // console.debug("Signin/created/api", api); //DELETE
    // console.debug("Signin/created/user", this.user); //DELETE
  },
  mounted() {},
};
</script>

<style lang="scss">
.signin-page {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: center;
  align-items: center;
  padding: 0 24px;

  &__auth-dialog {
    &--error {
      &-title {
        color: #ff5252;
      }
    }
  }

  & > .v-card {
    padding: 16px;
  }

  &__form {
    margin-top: 20px;
  }
  &__form-input {
    margin-top: 10px;

    &:first-child {
      margin-top: 0;
    }
  }
  &__form-button {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: center;
    padding-top: 8px;

    button {
      width: 280px;
      margin: 0 !important;
    }
  }
}
</style>