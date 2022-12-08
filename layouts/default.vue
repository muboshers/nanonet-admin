<template>
  <v-app>
    <!-- Sidebar section -->
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item :to="localePath('/')" router exact>
          <v-list-item-action>
            <v-img
              lazy-src="https://nanonet.vercel.app/img/logo/consulty-logo.png"
              max-height="60"
              max-width="130"
              contain
              src="https://nanonet.vercel.app/img/logo/consulty-logo.png"
            />
          </v-list-item-action>
        </v-list-item>
        <v-list-item :to="localePath('/blog')" router exact>
          <v-list-item-action>
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-action>
          <v-list-item-content class="mx-2"
            >{{ $t("sidebar.blog") }}
          </v-list-item-content>
          <v-list-item-action>
            <v-icon> </v-icon>
          </v-list-item-action>
        </v-list-item>
        <v-list-item :to="localePath('/about')" router exact>
          <v-list-item-action>
            <v-icon>mdi-domain</v-icon>
          </v-list-item-action>
          <v-list-item-content class="mx-2"
            >{{ $t("sidebar.about") }}
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="localePath('/category')" router exact>
          <v-list-item-action>
            <v-icon>mdi-server</v-icon>
          </v-list-item-action>
          <v-list-item-content class="mx-2"
            >{{ $t("sidebar.category") }}
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!-- Sidebar section -->

    <!-- Navbar Section -->
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>

      <!-- <v-toolbar-title>{{ title }}</v-toolbar-title> -->
      <v-spacer />
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <!-- Main Section -->

    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

    <!-- Main Section -->

    <!-- Settings section  -->
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = true">
          <v-list-item-action>
            <v-btn
              class="mx-2"
              @click="colorSwitch"
              fab
              dark
              small
              :color="this.$vuetify.theme.dark ? 'white' : 'dark'"
            >
            </v-btn>
          </v-list-item-action>
          <v-list-item-title class="mx-2">
            {{ $t("sidebar.settings") }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-select
            solo
            v-model="language"
            :items="languages"
            :hint="$t('languages')"
            :item-value="language"
            :label="$t('languages')"
          ></v-select>
        </v-list-item>
        <v-list-item>
          <v-list-item-title class="mx-2">
            {{ admin?.data?.data?.username }}
          </v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-btn color="error" @click="logout">
            {{ $t("logout") }}
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Settings section -->

    <!-- Footer Section -->
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
    <!-- Footer Section -->
  </v-app>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "DefaultLayout",
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      language: "",
      languages: ["en", "ru", "uz"],
    };
  },
    methods: {
    colorSwitch() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
    logout() {
      localStorage.clear();
      this.$router.push({ name: "login___en", path: "/login" });
    },
  },
  computed: {
    ...mapState({
      admin: (state) => state.admin,
    }),
  },
  watch: {
    language() {
      this.$i18n.setLocale(this.language);
    },
  },
};
</script>
