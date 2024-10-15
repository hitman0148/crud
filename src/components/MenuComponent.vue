<template>
  <q-layout class="bg-blue-grey-9" view="lHh Lpr lFf">
    <q-header
      elevated
      class="text-white"
      style="background: #24292e;"
      height-hint="61.59"
    >
      <q-toolbar class="q-py-sm q-px-md">
        <q-btn
          round
          dense
          flat
          :ripple="false"
          :icon="fabGithub"
          size="19px"
          color="white"
          class="q-mr-sm"
          no-caps
          @click="drawer = !drawer"
        />
        <!-- <q-btn round dense flat :ripple="false" :icon="['fas','pencil-mechanical']" size="19px" color="white" class="q-mr-sm" no-caps /> -->
        <!-- <q-space/> -->

        <div
          v-if="$q.screen.gt.sm"
          class="GL__toolbar-link q-ml-xs q-gutter-md text-body2 text-weight-thin row items-center no-wrap"
        >
          <a
            v-for="link in links"
            :key="link"
            :href="link.path"
            :class="link.name == this.$route.name ? 'active' : ''"
            >{{ link.label }}</a
          >
        </div>

        <q-space />

        <div class="q-pl-sm q-gutter-sm row items-center no-wrap">
          <q-btn dense flat no-wrap round>
            <q-avatar round size="28px" v-if="userData.profile != ''">
              <img
                style="border: solid 2px darkred;"
                class="absolute-center"
                :src="
                  userData.profile != '' && userData.profile != 'null'
                    ? userData.profile
                    : 'https://cdn.quasar.dev/img/boy-avatar.png'
                "
              />
            </q-avatar>
            <q-avatar
              size="24px"
              v-else
              :style="{
                'background-color': this.randomColor(),
                border: 'solid 1px white',
              }"
              text-color="white"
              class="text-weight-bold"
            >
              <!--              <div class="absolute-center">{{ this.$q.localStorage.getItem('fullname').split('')[0].toUpperCase()}}</div>-->
              <div class="absolute-center">
                {{ userData.fullname.split("")[0].toUpperCase() }}
              </div>
            </q-avatar>
            <!-- <q-icon name="arrow_drop_down" size="16px" /> -->

            <q-menu auto-close class="bg-grey-4">
              <q-list dense>
                <q-item class="GL__menu-link-signed-in">
                  <q-item-section>
                    <!--                    <div>Signed in as <strong>{{ this.$q.localStorage.getItem('fullname')}}</strong></div>-->
                    <div>
                      Signed in as <strong>{{ userData.fullname }}</strong>
                    </div>
                  </q-item-section>
                </q-item>
                <q-separator />
                <!--                <q-item clickable class="GL__menu-link-status">-->
                <!--                  <q-item-section>-->
                <!--                    <div>-->
                <!--                      <q-icon name="tag_faces" color="blue-9" size="20px" />-->
                <!--                      Happy!!!!-->
                <!--                    </div>-->
                <!--                  </q-item-section>-->
                <!--                </q-item>-->
                <!--                <q-separator />-->
                <!--                <q-item clickable class="GL__menu-link">-->
                <!--                  <q-item-section>Your profile</q-item-section>-->
                <!--                </q-item>-->
                <q-item clickable class="GL__menu-link" @click="logout">
                  <q-item-section>Sign out</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :width="250"
      :breakpoint="500"
      bordered
      dark
    >
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px;">
        <q-list padding>
          <q-item
            class="menu"
            clickable
            v-ripple
            v-for="link in links"
            :key="link"
            :class="this.$route.name == link.name ? 'active-menu' : ''"
            :href="link.path"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              {{ link.label }}
            </q-item-section>
          </q-item>
          <q-separator dark inset />
          <q-item clickable v-ripple class="logout" @click="logout">
            <q-item-section avatar>
              <q-icon name="power_settings_new" color="negative" />
            </q-item-section>
            <q-item-section>
              Logout
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-img
        class="absolute-top"
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 150px;"
      >
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm" v-if="userData.profile != ''">
            <img
              :src="
                userData.profile != '' && userData.profile != 'null'
                  ? userData.profile
                  : 'https://cdn.quasar.dev/img/boy-avatar.png'
              "
            />
          </q-avatar>
          <q-avatar
            size="56px"
            v-else
            :style="{
              'background-color': this.randomColor(),
              border: 'solid 1px darkred',
            }"
            text-color="white"
            class="text-weight-bold"
          >
            <div class="absolute-center">
              {{ userData.fullname.split("")[0].toUpperCase() }}
            </div>
          </q-avatar>

          <div class="text-weight-bold">{{ userData.fullname }}</div>
          <div>{{ userData.employee_id }}</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { fabGithub } from "@quasar/extras/fontawesome-v6";
const stringOptions = [
  "quasarframework/quasar",
  "quasarframework/quasar-awesome",
];
import mixin from "../mixin";
export default {
  name: "MyLayout",
  mixins: [mixin],
  setup() {
    const text = ref("");
    const options = ref(null);
    const filteredOptions = ref([]);
    const search = ref(null); // $refs.search
    function filter(val, update) {
      if (options.value === null) {
        // load data
        setTimeout(() => {
          options.value = stringOptions;
          search.value.filter("");
        }, 2000);
        update();
        return;
      }
      if (val === "") {
        update(() => {
          filteredOptions.value = options.value.map((op) => ({ label: op }));
        });
        return;
      }
      update(() => {
        filteredOptions.value = [
          {
            label: val,
            type: "In this repository",
          },
          {
            label: val,
            type: "All GitHub",
          },
          ...options.value
            .filter((op) => op.toLowerCase().includes(val.toLowerCase()))
            .map((op) => ({ label: op })),
        ];
      });
    }
    return {
      fabGithub,
      text,
      options,
      filteredOptions,
      search,
      filter,
      drawer: ref(false),
    };
  },
  data() {
    return {
      links: [
        {
          label: "HRIS",
          name: "hris",
          path: "#/hris",
          icon: "groups",
        },
        {
          label: "Payslip",
          name: "payslip",
          path: "#/payslip",
          icon: "folder_shared",
        },
        {
          label: "Profile",
          name: "profile",
          path: "#/profile",
          icon: "person",
        },
        {
          label: "User List",
          name: "user",
          path: "#/user",
          icon: "person_search",
        },
        {
          label: "Domain List",
          name: "domain",
          path: "#/domain",
          icon: "dns",
        },
        {
          label: "History",
          name: "history",
          path: "#/history",
          icon: "history",
        },
      ],
    };
  },
  methods: {
    logout() {
      this.$q
        .dialog({
          dark: true,
          title: "Logout",
          message: "Do you want to logout?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          var datas = this.$q.cookies.getAll();
          // this.logActions(datas,'Logout',this.$q.localStorage.getItem('id'))
          this.logActions(datas, "Logout", this.$q.cookies.get("id"));
          this.logoutData();
        });
    },

    randomColor() {
      return "#" + ((Math.random() * 0xffffff) << 0).toString(16);
    },
  },
  // created() {
  //   if(this.$q.cookies.get('is_auth') != 'true'){
  //     window.location = '#/'
  //     this.logoutData()
  //   }
  // },
};
</script>

<style lang="sass">
.GL
  &__select-GL__menu-link
    .default-type
      visibility: hidden
    &:hover
      background: #0366d6
      color: white
      .q-item__section--side
        color: white
      .default-type
        visibility: visible
  &__toolbar-link
    a
      color: grey
      text-decoration: none
  &__menu-link:hover
    background: #0366d6
    color: white

  &__menu-link-status
    color: $blue-grey-6
    &:hover
      color: $light-blue-9
  &__toolbar-select.q-field--focused
    width: 450px !important
    .q-field__append
      display: none


.active
  color: white !important
  padding:2px 7px 2px 7px
  border-bottom: white 2px solid
  &:hover
    opacity: 1
    color:  white

a.menu:hover
  opacity: 0.7
  color: black
  background-color: grey
  border-radius:0px 50px 50px 0px

div.logout:hover
  opacity: 0.7
  color: black
  background-color: grey
  border-radius:0px 50px 50px 0px

.active-menu
  color: white !important
  opacity: 0.7
  background-color: red
  border-radius:0px 50px 50px 0px
  padding:2px 7px 2px 7px
  &:hover
    opacity: 1
    color:  black
    border-radius:0px 50px 50px 0px
</style>
