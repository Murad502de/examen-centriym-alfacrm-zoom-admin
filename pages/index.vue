<template lang="pug">
.webinar-list-page
  v-card.webinar-list-page__card(
    max-width="1000",
    min-width="800",
    elevation="7"
  )
    .webinar-list-page__card--head
      v-list-item-title.text-h5.webinar-list-page__title Комнаты Zoom
      v-btn.mr-4.webinar-list-page--add-webinar(
        color="blue",
        width="128",
        height="36",
        :disabled="!webinarsFetched",
        @click="addWebinar"
      ) Добавить

    .webinar-list-page__card--body
      .webinar-list-page__list
        Skeleton.webinar-list-page__list-item(
          v-for="skeleton in 3",
          v-if="!webinarsFetched",
          height="60"
        )
        v-card.webinar-list-page__list-item(
          v-for="(webinar, index) in webinars",
          :key="webinar.uuid",
          max-width="900",
          min-width="700",
          elevation="3"
        )
          .webinar-list-page__list-item--name {{ webinar.name }}
          .webinar-list-page__list-item--actions
            v-btn(
              icon,
              elevation="0",
              height="32",
              width="32",
              :disabled="webinar.deleteLoader",
              @click="editWebinar({ uuid: webinar.uuid })"
            )
              v-icon.webinar-list-page__list-item--actions_edit(
                color="#607d8b"
              ) mdi-pencil

            v-btn(
              icon,
              elevation="0",
              height="32",
              width="32",
              :loading="webinar.deleteLoader",
              @click="deleteWebinar({ uuid: webinar.uuid })"
            )
              v-icon.webinar-list-page__list-item--actions_delete(
                color="#ff5252"
              ) mdi-delete

  v-dialog(v-model="dialog", max-width="500")
    v-card
      v-card-title.text-h5 Подтверждение удаления
      v-card-text Вы действительно хотите удалить данный вебинар "Вебинар 123", включая все привязанные подарки и их настройки?
      v-card-actions
        v-spacer
        v-btn(color="green darken-1", text, @click="cancelDeleteWebinar") Отменить
        v-btn(color="error darken-1", text, @click="approveDeleteWebinar") Удалить
</template>

<script>
import { mapState } from "pinia";
import { mapActions } from "pinia";
import { useWebinarStore } from "@/store/WebinarStore";
import { fetchWebinars } from "@/api/webinar/webinars";
import { deleteWebinar } from "@/api/webinar/webinar";
import Skeleton from "@/components/ui-embedded/Skeleton";

export default {
  components: {
    Skeleton,
  },

  props: {},
  data() {
    return {
      dialog: false,
      webinars: [],
      webinarsFetched: false,
      deleteWebinarUuid: null,
    };
  },
  computed: {
    ...mapState(useWebinarStore, {
      webinarsStore: "webinarList",
    }),
  },

  watch: {},
  methods: {
    /* GETTERS */
    /* SETTERS */
    /* HANDLERS */
    addWebinar() {
      // console.debug("add"); //DELETE

      this.$router.push({
        name: "webinar",
      });
    },
    editWebinar({ uuid }) {
      // console.debug("pages/webinars/methods/editWebinar", uuid); //DELETE

      this.$router.push({
        name: "webinar",
        query: {
          uuidWebinar: uuid,
        },
      });
    },
    deleteWebinar({ uuid }) {
      // console.debug("pages/webinars/methods/deleteWebinar", uuid); //DELETE

      this.deleteWebinarUuid = uuid;
      this.dialog = true;
    },
    async approveDeleteWebinar() {
      // console.debug("pages/webinars/methods/approveDeleteWebinar"); //DELETE

      this.dialog = false;

      if (this.deleteWebinarUuid) {
        // console.debug("pages/webinars/methods/approveDeleteWebinar/delete"); //DELETE

        this.webinars.forEach((webinar) => {
          if (webinar.uuid === this.deleteWebinarUuid) {
            // console.debug(
            //   "pages/webinars/methods/approveDeleteWebinar/deleteWebinarUuid",
            //   this.deleteWebinarUuid
            // ); //DELETE

            webinar.deleteLoader = true;
          }
        });

        const response = await deleteWebinar(this.deleteWebinarUuid);

        // console.debug(
        //   "pages/webinars/methods/approveDeleteWebinar/response",
        //   response
        // ); //DELETE

        if (response.status === 200) {
          this.webinars = this.webinars.filter(
            (webinar) => webinar.uuid !== this.deleteWebinarUuid
          );
        } else {
          alert("Ошибка при удалении");
        }
      }

      this.deleteWebinarUuid = null;
    },
    cancelDeleteWebinar() {
      // console.debug("pages/webinars/methods/cancelDeleteWebinar"); //DELETE

      this.deleteWebinarUuid = null;
      this.dialog = false;
    },

    /* HELPERS */
    /* ACTIONS */
  },

  async created() {
    // console.debug("pages/webinars/created", this.$route); //DELETE

    const response = await fetchWebinars();

    this.webinars = response.webinars.data.map((webinar) => ({
      ...webinar,
      deleteLoader: false,
    }));
    this.webinarsFetched = true;

    // console.debug("pages/webinars/webinars", this.webinars); //DELETE
    // console.debug("pages/webinars/webinarsFetched", this.webinarsFetched); //DELETE
  },
  mounted() {},
};
</script>

<style lang="scss">
.webinar-list-page {
  box-sizing: border-box;
  padding: 24px 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: center;
  align-items: flex-start;

  &--add-webinar {
    margin: 0 !important;
  }

  &__card {
    padding: 24px;

    &--head {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: space-between;
      align-items: center;
    }
  }

  &__list {
    box-sizing: border-box;
    margin-top: 32px;

    &-item {
      padding: 14px;
      margin-top: 14px;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: space-between;
      align-items: center;

      &:first-child {
        margin-top: 0;
      }

      &--name {
        flex: 1;
      }

      &--actions {
        &_delete {
          // margin-left: 14px;
          cursor: pointer;
        }
        &_edit {
          cursor: pointer;
        }
      }
    }
  }
}
</style>