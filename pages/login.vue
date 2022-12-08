<template>
  <v-container>
    <v-alert v-if="error.length > 0" dense outlined type="error">
      {{ error }}
    </v-alert>

    <v-row align="center" justify="center" style="height: 100vh">
      <v-col sm="6" md="6">
        <v-card style="padding: 1rem" elevation="3" outlined>
          <v-form v-model="valid">
            <v-container>
              <v-row align="center" justify="center">
                <v-img
                  style="margin: 15px 0; cursor: pointer"
                  lazy-src="https://nanonet.vercel.app/img/logo/consulty-logo.png"
                  max-height="150"
                  max-width="180"
                  contain
                  src="https://nanonet.vercel.app/img/logo/consulty-logo.png"
                />
                <v-col cols="12">
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="Enter Email"
                    required
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    :append-icon="value ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append="() => (value = !value)"
                    label="Enter your password"
                    :type="value ? 'text' : 'password'"
                    required
                  />
                </v-col>

                <v-btn
                  block
                  @click="signIn"
                  color="primary"
                  style="margin: 10px 0"
                >
                  Sign In
                </v-btn>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations } from "vuex";
// import axios from "axios";
export default {
  name: "LoginPage",
  layout: "pagelayout",

  data: () => ({
    valid: false,
    value: false,
    error: "",
    email: "",
    passwordRules: [(v) => !!v || "Password is required"],
    password: "",
    emailRules: [
      (v) => !!v || "password is required",
      // (v) => /.+@.+/.test(v) || "E-mail must be valid",
    ],
  }),

  methods: {
    async signIn() {
      let newDate = new Date().getDate();
      this.formRequest()
        .then((result) => result.json())
        .then((data) => {
          if (!data.data.token) {
            throw data;
          }
          this.login(data.data);
          localStorage.setItem(
            "user",
            JSON.stringify({ data: data.data, tokenCreadintinal: newDate })
          );
          this.$router.push({ name: "index___en", path: "/" });
        })
        .catch((err) => (this.error += err.message));
    },
    async formRequest() {
      return await fetch(
        "https://consultingweb.duckdns.org/api/v1/auth/login",
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods":
              "GET, POST, PATCH, PUT, DELETE, OPTIONS",
          },
          method: "POST",
          body: JSON.stringify({
            username: this.email,
            password: this.password,
          }),
        }
      );
    },

    ...mapMutations([
      "login", // map login  mutation
    ]),
  },

  mounted() {
    let todayDate = new Date().getDate();
    let user = JSON.parse(localStorage.getItem("user"));
    if (user !== null || undefined) {
      if (user.tokenCreadintinal == todayDate) {
        this.login(user);
        this.$router.push({ name: "index___en", path: "/" });
      } else {
        localStorage.clear();
      }
    }
  },

  head: {
    title: "Nanonet Login",
  },
};
</script>
