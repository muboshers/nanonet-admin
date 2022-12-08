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
          <v-col align="end" justify="flex-end overflow-auto">
            <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
              <v-icon> mdi-plus </v-icon>
              {{ $t("category.title") }}
            </v-btn>
          </v-col>
          <v-col class="mt-5 col-12 overflow-hidden">
            <v-data-table
              v-if="data.length > 0"
              :headers="headers"
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
                <v-btn
                  @click="deleteBlog(item.id)"
                  color="red"
                  dark
                  class="mx-2"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>

                <v-btn @click="editBlog(item)" color="primary" class="mx-2">
                  <EditIcon />
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
        <v-card-title v-if="action === 'create'" class="text-h5 grey lighten-2">
          {{ $t("about.title") }}
        </v-card-title>
        <v-card-title
          v-else-if="action === 'edit'"
          class="text-h5 grey lighten-2"
        >
          {{ $t("about.form.edit") }}
        </v-card-title>
        <v-card-title v-else class="text-h5 grey lighten-2">
          {{ $t("blog.form.delete") }}
        </v-card-title>
        <v-form v-model="valid">
          <!-- create form -->
          <v-container v-if="action === 'create'">
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
                  :label="$t('about.form.title') + ' UZB'"
                  required
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4">
                <v-textarea
                  filled
                  v-model="EN.description"
                  :label="$t('about.form.description') + ' ENG'"
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
          <!-- Edit form -->
          <v-container v-else-if="action === 'edit'">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  filled
                  v-model="editData.title"
                  :label="$t('about.form.title') + ' ' + $t('lanaguege')"
                  :rules="titleRules"
                  required
                />
                <v-textarea
                  filled
                  v-model="editData.description"
                  :rules="descriptionRules"
                  :label="$t('about.form.description') + ' ' + $t('lanaguege')"
                  required
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="action === 'create'"
            color="primary"
            text
            @click="createblog"
          >
            {{ $t("blog.form.submit") }}
          </v-btn>
          <v-btn
            v-else-if="action === 'edit'"
            color="primary"
            text
            @click="handleEditBlog(id)"
          >
            {{ $t("blog.form.edit") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import EditIcon from "../components/EditIcon";

export default {
  middleware: "auth",
  name: "ServicePage",
  components: {
    EditIcon,
  },
  data: () => ({
    valid: false,
    errorField: null,
    id: null,
    action: "create",
    titleRules: [
      (v) => !!v || "Title is required",
      (v) => v.length <= 50 || "Title must be less than 255 characters",
    ],
    descriptionRules: [
      (v) => !!v || "Description is required",
      (v) => v.length <= 255 || "Description must be less than 255 characters",
    ],
    categoryRules: [(v) => !!v || "Category is required"],
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
    editData: null,
    headers: [],
    data: [],
    dialog: false,
    language: "",
  }),
  head: {
    title: "Nanonet Services",
  },

  methods: {
    async createblog() {
      if (this.valid) {
        await this.createInformation()
          .then((result) => result.json())
          .then((d) => (this.data = [...this.data, d.data]))
          .catch((err) => {
            this.errorField = "Something wrong";

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
        `https://consultingweb.duckdns.org/api/v1/category/create?lang=${this.$t(
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

    async getAllblogInformation() {
      return await fetch(
        `https://consultingweb.duckdns.org/api/v1/category/list?lang=${this.$t(
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
      await this.getAllblogInformation()
        .then((res) => res.json())
        .then((d) => {
          console.log(d);
          this.data = d.data;
        })
        .catch((err) => {
          this.errorField = err.message;

          setTimeout(() => {
            this.errorField = null;
          }, 2000);
        });
    },

    editBlog(item) {
      this.action = "edit";
      this.dialog = true;
      this.id = item.id;
      this.editData = {
        title: item.title,
        description: item.description,
      };
    },

    async deleteBlogRequest(id) {
      return await fetch(
        `https://consultingweb.duckdns.org/api/v1/category/delete/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            AUTHORIZATION: `Bearer ${
              JSON.parse(localStorage.getItem("user")).data.token
            }`,
          },
          method: "DELETE",
        }
      );
    },

    async updateRequest(id) {
      return await fetch(
        `https://consultingweb.duckdns.org/api/v1/category/update/${id}?lang=${this.$t(
          "lanaguege"
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            AUTHORIZATION: `Bearer ${
              JSON.parse(localStorage.getItem("user")).data.token
            }`,
          },
          method: "PUT",
          body: JSON.stringify({
            EN: this.editData,
            RU: this.editData,
            UZ: this.editData,
          }),
        }
      );
    },

    async deleteBlog(id) {
      this.deleteBlogRequest(id)
        .then((res) => res.json())
        .then((d) => {
          this.data = this.data.filter((blog) => blog.id !== id);
        })
        .catch((err) => console.log(err));
    },
    handleEditBlog(id) {
      this.dialog = false;
      this.updateRequest(id)
        .then((res) => res.json())
        .then((d) => {
          this.getInfoToData();
        });
      this.id = null;
    },
    dateFormat(date) {
      const today = new Date(date);

      return `${today.getDate()}/${
        today.getMonth() + 1
      }/${today.getFullYear()}`;
    },
  },

  mounted() {
    this.getInfoToData();
  },
  beforeMount() {
    this.language = this.$root.$t("lanaguege");
    this.headers = [
      {
        text: this.$root.$t("blog.dataTable.title"),
        align: "start",
        sortable: false,
        value: "title",
        width: 200,
      },
      {
        text: this.$root.$t("blog.dataTable.description"),
        align: "start",
        sortable: false,
        value: "description",
        width: 200,
      },

      {
        text: this.$root.$t("blog.dataTable.action"),
        align: "center",
        sortable: false,
        value: "action",
        width: 250,
      },
    ];
  },

  watch: {
    dialog() {
      if (!this.dialog) { 
        this.action = "create";
        this.getInfoToData();
      }
    },

    langauge() {
      this.getInfoToData();
    },
  },
  updated:{
    
  }
};
</script>

<style>
.alert-container {
  position: absolute;
  z-index: 1;
  top: 5%;
}
</style>
