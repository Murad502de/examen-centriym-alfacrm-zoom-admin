<template lang="pug">
.webinar-detail-page
  v-card.webinar-detail-page__card(width="800", elevation="7")
    .webinar-detail-page__card--head
      v-list-item-title.text-h5.webinar-detail-page__title {{ webinarName }}
      .webinar-detail-page__card--actions
        v-btn.webinar-detail-page__card--actions-item(
          color="blue",
          width="128",
          height="36",
          :disabled="webinarSaveLoader",
          @click="back"
        ) Назад
        v-btn.mr-4.webinar-detail-page__card--actions-item(
          color="success",
          width="128",
          height="36",
          :disabled="!webinarValid",
          :loading="webinarSaveLoader",
          @click="saveWebinar"
        ) Сохранить

    .webinar-detail-page__card--body
      v-form.webinar-detail-page__webinar-info(
        ref="form",
        v-model="webinarValid",
        lazy-validation
      )
        v-text-field.webinar-detail-page__form-input(
          v-model="webinarName",
          label="Название вебинара",
          variant="outlined",
          color="blue",
          required,
          :rules="webinarNameRules"
        )
        v-text-field.webinar-detail-page__form-input(
          v-model="webinarCode",
          label="Идентификационный номер вебинара",
          variant="outlined",
          color="blue",
          required,
          :rules="webinarCodeRules"
        )

      .webinar-detail-page__gifts
        .webinar-detail-page__gifts--head
          v-list-item-title.text-h6.webinar-detail-page__gifts-title Подарки
          v-btn.mx-2(
            color="indigo",
            :disabled="webinarSaveLoader",
            @click="addGift"
          ) Добавить

        .webinar-detail-page__gifts--body
          v-card.webinar-detail-page__gift(
            v-for="(gift, index) in readGifts",
            :key="gift.uuid",
            max-width="900",
            min-width="700",
            elevation="3"
          )
            .webinar-detail-page__gift--name {{ gift.name }}
            .webinar-detail-page__gift--actions
              v-btn(
                icon,
                elevation="0",
                height="32",
                width="32",
                :disabled="webinarSaveLoader",
                @click="editGift({ uuid: gift.uuid })"
              )
                v-icon.webinar-detail-page__gift--actions_edit(color="#607d8b") mdi-pencil

              v-btn(
                icon,
                elevation="0",
                height="32",
                width="32",
                :disabled="webinarSaveLoader",
                @click="deleteGift({ uuid: gift.uuid })"
              )
                v-icon.webinar-detail-page__gift--actions_delete(
                  color="#ff5252"
                ) mdi-delete

  v-dialog(v-model="giftDeleteDialog", max-width="500")
    v-card
      v-card-title.text-h5 Подтверждение удаления
      v-card-text Вы действительно хотите удалить данный подарок "Подарок 123"?
      v-card-actions
        v-spacer
        v-btn(color="green darken-1", text, @click="cancelDeleteGift") Отменить
        v-btn(color="error darken-1", text, @click="approveDeleteGift") Удалить

  v-dialog(v-model="webinarEscapeDialog", max-width="500")
    v-card
      v-card-title.text-h5 Подтверждение ухода
      v-card-text Вы действительно хотите вернуться к списку вебинаров? Внимание, все несохранённые изменения будут удалены.
      v-card-actions
        v-spacer
        v-btn(
          color="green darken-1",
          text,
          @click="webinarEscapeDialog = false"
        ) Отменить
        v-btn(color="error darken-1", text, @click="approveBack") Назад

  v-dialog(v-model="giftDetailDialog", persistent, max-width="700")
    v-card
      v-card-title.text-h5 {{ giftDetailName }}
      v-form.webinar-detail-page__gift-detail(
        ref="form",
        v-model="giftDetailValid",
        lazy-validation
      )
        v-row
          v-col
            v-text-field.webinar-detail-page__form-input(
              v-model="giftDetailName",
              label="Название подарка",
              variant="outlined",
              color="blue",
              required,
              :rules="giftDetailNameRules"
            )

        v-row
          v-col
            v-text-field.webinar-detail-page__form-input(
              v-model="giftDetailQueueNumber",
              label="Порядковый номер в очереди",
              variant="outlined",
              color="blue",
              required,
              :rules="giftDetailQueueNumberRules"
            )

          v-col
            v-text-field.webinar-detail-page__form-input(
              v-model="giftDetailDelay",
              label="Задержка в выдаче в секундах",
              variant="outlined",
              color="blue",
              required,
              :rules="giftDetailDelayRules"
            )
        v-row
          v-col
            v-text-field.webinar-detail-page__form-input(
              v-model="giftDetailLink",
              label="Ссылка на скачивание",
              variant="outlined",
              color="blue",
              required,
              :rules="giftDetailLinkRules"
            )
      v-card-actions
        v-spacer
        v-btn(color="error darken-1", text, @click="cancelGiftDetailDialog") Отменить
        v-btn(color="green darken-1", text, @click="saveGiftDetailDialog") Сохранить
</template>

<script>
import {
  createWebinar,
  fetchWebinarDetail,
  updateWebinar,
} from "@/api/webinar/webinar";
import { createGift, updateGift, deleteGift } from "@/api/gift/gift";

export default {
  components: {},

  props: {},
  data() {
    return {
      webinarSaveLoader: false,
      webinarValid: true,
      webinarEscapeDialog: false,

      webinarName: "",
      webinarNameRules: [(v) => !!v || "Обязательно к заполненнию"],
      webinarCode: "",
      webinarCodeRules: [(v) => !!v || "Обязательно к заполненнию"],

      giftDeleteDialog: false,
      giftDetailDialog: false,
      giftDetailValid: true,

      giftDetailUuid: null,
      giftDetailNew: false,
      giftDetailName: "",
      giftDetailNameRules: [(v) => !!v || "Обязательно к заполненнию"],
      giftDetailQueueNumber: "",
      giftDetailQueueNumberRules: [(v) => !!v || "Обязательно к заполненнию"],
      giftDetailDelay: "",
      giftDetailDelayRules: [(v) => !!v || "Обязательно к заполненнию"],
      giftDetailLink: "",
      giftDetailLinkRules: [(v) => !!v || "Обязательно к заполненнию"],

      gifts: [],
      addGifts: [],
      updateGifts: [],
      deleteGifts: [],
      deleteGiftUuid: null,
    };
  },
  computed: {
    uuidWebinar() {
      return this.$route.query.uuidWebinar;
    },
    isNew() {
      return !this.uuidWebinar;
    },
    readGifts() {
      return [...this.gifts, ...this.addGifts].filter(
        (gift) => !this.deleteGifts.includes(gift.uuid)
      );
    },
  },

  watch: {},
  methods: {
    /* GETTERS */
    /* SETTERS */
    /* HANDLERS */
    back() {
      // console.debug("webinar/back"); //DELETE

      this.webinarEscapeDialog = true;
    },
    approveBack() {
      // console.debug("webinar/approveBack"); //DELETE

      this.webinarEscapeDialog = false;
      this.$router.push({ name: "index" });
    },
    async saveWebinar() {
      // console.debug("pages/webinar/methods/save/isNew", this.isNew); //DELETE

      this.webinarSaveLoader = true;

      let uuidWebinar = "";

      if (this.isNew) {
        // console.debug("pages/webinar/methods/save/new"); //DELETE

        //TODO: create new Webinar
        const response = await createWebinar(
          this.webinarName,
          this.webinarCode
        );

        // console.debug("pages/webinar/methods/save/new/response", response); //DELETE

        if (response.status === 200) {
          uuidWebinar = response.webinarUuid;

          await this.saveGifts(response.webinarUuid);
          this.$router.push({
            name: "webinar",
            query: {
              uuidWebinar: response.webinarUuid,
            },
          });
        }
      } else {
        // console.debug("pages/webinar/methods/save/not-new"); //DELETE

        const response = await updateWebinar(
          this.uuidWebinar,
          this.webinarName,
          this.webinarCode
        );

        // console.debug("pages/webinar/methods/save/not-new/response", response); //DELETE

        await this.saveGifts(this.uuidWebinar);

        uuidWebinar = this.uuidWebinar;
      }

      // this.gifts = this.gifts.filter(
      //   (gift) => !this.deleteGifts.includes(gift.uuid)
      // );

      await this.fetch(uuidWebinar);

      this.addGifts = [];
      this.updateGifts = [];
      this.deleteGifts = [];
      this.webinarSaveLoader = false;
    },
    async saveGifts(webinarUuid) {
      // console.debug("pages/webinar/methods/saveGifts/webinarUuid", webinarUuid); //DELETE

      if (!webinarUuid) {
        return;
      }

      // console.debug("pages/webinar/methods/save/addGifts", this.addGifts); //DELETE

      for (let i = 0; i < this.addGifts.length; i++) {
        // console.debug("pages/webinar/methods/save/addGift", this.addGifts[i]); //DELETE

        await createGift(
          webinarUuid,
          this.addGifts[i].name,
          this.addGifts[i].number,
          this.addGifts[i].delay,
          this.addGifts[i].link
        );
      }

      // console.debug("pages/webinar/methods/save/updateGifts", this.updateGifts); //DELETE

      for (let i = 0; i < this.updateGifts.length; i++) {
        // console.debug(
        //   "pages/webinar/methods/save/updateGift",
        //   this.updateGifts[i]
        // ); //DELETE

        const gift = this.gifts.find(
          (gift) => gift.uuid === this.updateGifts[i]
        );

        // console.debug("pages/webinar/methods/save/updateGift/gift", gift); //DELETE

        if (gift) {
          await updateGift(
            gift.uuid,
            gift.name,
            gift.number,
            gift.delay,
            gift.link
          );
        }
      }

      // console.debug("pages/webinar/methods/save/deleteGifts", this.deleteGifts); //DELETE

      for (let i = 0; i < this.deleteGifts.length; i++) {
        // console.debug(
        //   "pages/webinar/methods/save/deleteGift",
        //   this.deleteGifts[i]
        // ); //DELETE

        await deleteGift(this.deleteGifts[i]);
      }
    },
    addGift() {
      // console.debug("pages/webinar/methods/addGift"); //DELETE

      this.giftDetailNew = true;
      this.giftDetailDialog = true;
      this.giftDetailUuid = new Date().getTime();
    },
    editGift({ uuid }) {
      // console.debug("pages/webinar/methods/editGift", uuid); //DELETE

      this.giftDetailNew = false;
      this.giftDetailDialog = true;

      const gift = this.readGifts.find((readGift) => readGift.uuid === uuid);

      this.giftDetailUuid = uuid;
      this.giftDetailName = gift.name;
      this.giftDetailQueueNumber = gift.number;
      this.giftDetailDelay = gift.delay;
      this.giftDetailLink = gift.link;
    },
    cancelGiftDetailDialog() {
      // console.debug("pages/webinar/methods/cancelGiftDetailDialog"); //DELETE

      // if (this.giftDetailNew) {
      //   console.debug(
      //     "pages/webinar/methods/cancelGiftDetailDialog/AddNewGift"
      //   ); //DELETE
      // } else {
      //   console.debug("pages/webinar/methods/cancelGiftDetailDialog/EditGift"); //DELETE
      // }

      this.giftDetailDialog = false;
      this.closeGiftDetailDialog();
    },
    async saveGiftDetailDialog() {
      // console.debug("pages/webinar/methods/saveGiftDetailDialog"); //DELETE

      const editedGift = {
        uuid: this.giftDetailUuid,
        name: this.giftDetailName,
        number: this.giftDetailQueueNumber,
        delay: this.giftDetailDelay,
        link: this.giftDetailLink,
      };

      if (this.giftDetailNew) {
        // console.debug("pages/webinar/methods/saveGiftDetailDialog/AddNewGift"); //DELETE

        this.addGifts.push(editedGift);
      } else {
        // console.debug("pages/webinar/methods/saveGiftDetailDialog/EditGift"); //DELETE

        const fromGiftsIndex = this.gifts.findIndex(
          (gift) => gift.uuid === editedGift.uuid
        );

        // console.debug(
        //   "pages/webinar/methods/saveGiftDetailDialog/EditGift/fromGiftsIndex",
        //   fromGiftsIndex
        // ); //DELETE

        if (fromGiftsIndex !== -1) {
          // console.debug(
          //   "pages/webinar/methods/saveGiftDetailDialog/EditGift/from-server"
          // ); //DELETE

          this.gifts[fromGiftsIndex] = editedGift;

          const fromUpdateGifts = this.updateGifts.includes(editedGift.uuid);

          // console.debug(
          //   "pages/webinar/methods/saveGiftDetailDialog/EditGift/from-server/fromUpdateGifts",
          //   fromUpdateGifts
          // ); //DELETE

          if (!fromUpdateGifts) {
            this.updateGifts.push(editedGift.uuid);
          }
        } else {
          // console.debug(
          //   "pages/webinar/methods/saveGiftDetailDialog/EditGift/from-add"
          // ); //DELETE

          this.addGifts = this.addGifts.map((addGift) => {
            if (addGift.uuid === editedGift.uuid) {
              return { ...editedGift };
            }

            return { ...addGift };
          });
        }
      }

      this.giftDetailDialog = false;
      this.closeGiftDetailDialog();
    },
    closeGiftDetailDialog() {
      // console.debug("pages/webinar/methods/closeGiftDetailDialog"); //DELETE

      this.giftDetailUuid = null;
      this.giftDetailName = null;
      this.giftDetailQueueNumber = null;
      this.giftDetailDelay = null;
      this.giftDetailLink = null;
    },
    deleteGift({ uuid }) {
      // console.debug("pages/webinar/methods/deleteGift/uuid", uuid); //DELETE

      this.deleteGiftUuid = uuid;
      this.giftDeleteDialog = true;
    },
    approveDeleteGift() {
      // console.debug(
      //   "pages/webinar/methods/approveDeleteGift/deleteGiftUuid",
      //   this.deleteGiftUuid
      // ); //DELETE

      this.giftDeleteDialog = false;

      const fromAddGifts = this.addGifts.find(
        (addGift) => addGift.uuid === this.deleteGiftUuid
      );

      // console.debug(
      //   "pages/webinar/methods/approveDeleteGift/deleteGiftUuid/fromAddGifts",
      //   fromAddGifts
      // ); //DELETE

      if (fromAddGifts) {
        this.addGifts = this.addGifts.filter(
          (addGift) => addGift.uuid !== this.deleteGiftUuid
        );
      } else {
        this.deleteGifts.push(this.deleteGiftUuid);
        this.updateGifts = this.updateGifts.filter(
          (updateGift) => updateGift !== this.deleteGiftUuid
        );
      }

      this.deleteGiftUuid = null;
    },
    cancelDeleteGift() {
      // console.debug(
      //   "pages/webinar/methods/cancelDeleteGift/deleteGiftUuid",
      //   this.deleteGiftUuid
      // ); //DELETE

      this.giftDeleteDialog = false;

      this.deleteGiftUuid = null;
    },

    /* HELPERS */
    /* ACTIONS */
    async fetch(uuidWebinar) {
      // console.debug("pages/webinar/methods/fetch", this.isNew); //DELETE
      // console.debug("pages/webinar/methods/this.uuidWebinar", this.uuidWebinar); //DELETE
      // console.debug("pages/webinar/methods/uuidWebinar", uuidWebinar); //DELETE

      const response = await fetchWebinarDetail(
        this.uuidWebinar || uuidWebinar
      );

      // console.debug("pages/webinar/methods/fetch/response", response); //DELETE

      if (response.status === 200) {
        const webinar = response.webinar.data;

        // console.debug("pages/webinar/methods/fetch/response/webinar", webinar); //DELETE

        this.webinarName = webinar.name;
        this.webinarCode = webinar.code;
        this.gifts = webinar.gifts;
      } else {
        alert("Ошибка при получении вебинара");
      }
    },
  },

  async created() {
    // console.debug("pages/webinar/created/route", this.$route); //DELETE
    // console.debug("pages/webinar/created/uuidWebinar", this.uuidWebinar); //DELETE
    // console.debug("pages/webinar/created/isNew", this.isNew); //DELETE

    if (!this.isNew) {
      await this.fetch();
    }
  },
  mounted() {},
};
</script>

<style lang="scss">
.webinar-detail-page {
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

  &__form {
    &-input {
      margin-top: 8px;

      &:first-child {
        margin-top: 0;
      }
    }
  }

  &__card {
    padding: 24px;

    &--head {
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: space-between;
      align-items: center;
    }

    &--body {
      flex: 1;
      margin-top: 32px;
    }

    &--actions {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-end;
      align-items: center;

      &-item {
        margin: 0 !important;

        margin-left: 14px !important;

        &:first-child {
          margin-left: 0;
        }
      }
    }
  }

  &__gifts {
    box-sizing: border-box;
    margin-top: 32px;

    &--head {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: space-between;
      align-items: center;
    }

    &--body {
      margin-top: 24px;
    }
  }
  &__gift {
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

    &-detail {
      box-sizing: border-box;
      margin-top: 48px;
      padding: 0 24px;
    }
  }
}
</style>