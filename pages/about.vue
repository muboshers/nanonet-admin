<template>
  <v-row>
    <v-dialog v-model="dialog" width="700" height="700">
      <template v-slot:activator="{ on, attrs }">
        <div v-if="errorField" class="alert-container">
          <v-alert border="bottom" color="pink darken-1" dark>
            {{ errorField }}
          </v-alert>
        </div>
        <v-row class="mt-5 mx-2">
          <v-col align="end" class="col-12" justify="flex-end">
            <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
              <v-icon> mdi-plus </v-icon>
              {{ $t("about.title") }}
            </v-btn>
          </v-col>
          <v-col class="mt-5 col-12">
            <v-data-table
              :headers="headers"
              v-if="data.length > 0"
              :items="data"
            >
              <template #item.title="{ value, item }">
                <span>
                  {{ value }}
                </span>
              </template>

              <template #item.description="{ value, item }">
                <span>
                  {{ value }}
                </span>
              </template>

              <template #item.action="{ item }">
                <v-btn color="red" dark class="mx-2">
                  <v-icon>mdi-delete</v-icon>
                  {{ $t("about.form.delete") }}
                </v-btn>

                <v-btn color="primary" class="mx-2">
                  <v-icon>mdi-edit</v-icon>
                  {{ $t("about.form.edit") }}
                </v-btn>
              </template>
            </v-data-table>
            <v-col v-else align="center">
              <v-img
                lazy-src="https://img.freepik.com/premium-vector/folder-found_22110-498.jpg?w=2000"
                max-height="350"
                max-width="350"
                src="https://img.freepik.com/premium-vector/folder-found_22110-498.jpg?w=2000"
              />
            </v-col>
          </v-col>
        </v-row>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{ $t("about.title") }}
        </v-card-title>

        <v-form v-model="valid">
          <v-container>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="EN.title"
                  :rules="titleRules"
                  :label="$t('about.form.title') + ' EN'"
                  required
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="RU.title"
                  :rules="titleRules"
                  :label="$t('about.form.title') + ' RUS'"
                  required
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="UZ.title"
                  :rules="titleRules"
                  :label="$t('about.form.title') + ' UZ'"
                  required
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4">
                <v-textarea
                  filled
                  v-model="EN.description"
                  :label="$t('about.form.description') + ' EN'"
                  :rules="descriptionRules"
                  required
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-textarea
                  filled
                  v-model="RU.description"
                  :rules="descriptionRules"
                  :label="$t('about.form.description') + ' RUS'"
                  required
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-textarea
                  filled
                  v-model="UZ.description"
                  :rules="descriptionRules"
                  :label="$t('about.form.description') + ' UZB'"
                  required
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="createAbout">
            {{ $t("about.form.submit") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  middleware: "auth",
  name: "AboutPage",

  data: () => ({
    valid: false,
    errorField: null,
    titleRules: [
      (v) => !!v || "Title is required",
      (v) => v.length <= 255 || "Title must be less than 255 characters",
    ],
    descriptionRules: [
      (v) => !!v || "Description is required",
      (v) => v.length <= 255 || "Description must be less than 255 characters",
    ],
    UZ: {
      title: "",
      description: "",
    },
    EN: {
      title: "",
      description: "",
    },
    RU: {
      title: "",
      description: "",
    },

    headers: [],
    data: [],
    dialog: false,
  }),
  head: {
    title: "Nanonet Service",
  },

  methods: {
    async createAbout() {
      if (this.valid) {
        await this.createInformation()
          .then((result) => result.json())
          .then((d) => console.log(d))
          .catch((err) => {
            this.errorField = err.data.message;

            setTimeout(() => {
              this.errorField = null;
            }, 2000);
          });
        this.dialog = false;
      }
      this.EN.title = "";
      this.EN.description = "";

      this.RU.title = "";
      this.RU.description = "";

      this.UZ.title = "";
      this.UZ.description = "";
    },

    async createInformation() {
      return await fetch(
        `https://consultingweb.duckdns.org/api/v1/about-us?lang=${this.$t(
          "lanaguege"
        )}`,
        {
          headers: {
            "Content-Type": "application/json",

            AUTHORIZATION: `Bearer ${
              JSON.parse(localStorage.getItem("user")).data.token
            }`,
          },
          method: "POST",
          body: JSON.stringify({
            EN: this.EN,
            RU: this.RU,
            UZ: this.UZ,
          }),
        }
      );
    },

    async getAllAboutInformation() {
      return await fetch(
        `https://consultingweb.duckdns.org/api/v1/about-us?lang=${this.$t(
          "lanaguege"
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            AUTHORIZATION: `Bearer ${
              JSON.parse(localStorage.getItem("user")).data.token
            }`,
          },
          method: "GET",
        }
      );
    },

    async getInfoToData() {
      await this.getAllAboutInformation()
        .then((res) => res.json())
        .then((d) => {
          this.data = d.data;
        })
        .catch((err) => {
          this.errorField = err.message;

          setTimeout(() => {
            this.errorField = null;
          }, 2000);
        });
    },
  },

  mounted() {
    this.getInfoToData();
  },
  beforeMount() {
    this.headers = [
      {
        text: this.$root.$t("about.dataTable.title"),
        align: "start",
        sortable: false,
        value: "title",
      },
      {
        text: this.$root.$t("about.dataTable.description"),
        align: "start",
        sortable: false,
        value: "description",
      },
      {
        text: this.$root.$t("about.dataTable.action"),
        align: "center",
        sortable: false,
        value: "action",
      },
    ];
  },
};
</script>

<style>
.alert-container {
  position: absolute;
  z-index: 1;
  top: 5%;
}
</style>
