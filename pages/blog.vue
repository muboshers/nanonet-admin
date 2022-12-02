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
          <v-col md="12" align="end" justify="flex-end">
            <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
              <v-icon> mdi-plus </v-icon>
              {{ $t("blog.title") }}
            </v-btn>
          </v-col>
          <v-col md="12" class="mt-5">
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

              <template #item.author="{ value, item }">
                <span> {{ value }} 1 </span>
              </template>

              <template #item.createdDate="{ value, item }">
                <span>
                  {{ new Date(value).toLocaleDateString("en-US") }}
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
                  {{ $t("blog.form.delete") }}
                </v-btn>

                <v-btn @click="editBlog(item)" color="primary" class="mx-2">
                  <v-icon>mdi-edit</v-icon>
                  {{ $t("blog.form.edit") }}
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
          {{ $t("blog.title") }}
        </v-card-title>
        <v-card-title
          v-else-if="action === 'edit'"
          class="text-h5 grey lighten-2"
        >
          {{ $t("blog.form.edit") }}
        </v-card-title>
        <v-card-title v-else class="text-h5 grey lighten-2">
          {{ $t("blog.form.delete") }}
        </v-card-title>
        <v-form v-model="valid">
          <v-container v-if="action === 'create'">
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="EN.title"
                  :rules="titleRules"
                  :label="$t('blog.form.title') + ' EN'"
                  required
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="RU.title"
                  :rules="titleRules"
                  :label="$t('blog.form.title') + ' RUS'"
                  required
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="UZ.title"
                  :rules="titleRules"
                  :label="$t('blog.form.title') + ' UZ'"
                  required
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4">
                <v-textarea
                  filled
                  v-model="EN.description"
                  :label="$t('blog.form.description') + ' EN'"
                  :rules="descriptionRules"
                  required
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-textarea
                  filled
                  v-model="RU.description"
                  :rules="descriptionRules"
                  :label="$t('blog.form.description') + ' RUS'"
                  required
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-textarea
                  filled
                  v-model="RU.title"
                  :rules="titleRules"
                  :label="$t('blog.form.description') + $t('lanaguege')"
                  required
                />
              </v-col>
            </v-row>
          </v-container>
          <!-- Edit form -->
          <v-container v-else-if="action === 'edit'">
            <v-row>
              <v-col cols="12" md="8">
                <v-text-field
                  filled
                  v-model="editData.title"
                  :label="$t('blog.form.description') + $t('lanaguege')"
                  :rules="descriptionRules"
                  required
                />
                <v-textarea
                  filled
                  v-model="editData.description"
                  :rules="descriptionRules"
                  :label="$t('blog.form.description') + ' RUS'"
                  required
                />
              </v-col>
            </v-row>
          </v-container>
          <v-container else> </v-container>
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
            @click="handleEditBlog"
          >
            {{ $t("blog.form.edit") }}
          </v-btn>

          <v-btn v-else color="primary" text @click="createblog">
            {{ $t("blog.form.delete") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  middleware: "auth",
  name: "blogPage",

  data: () => ({
    valid: false,
    errorField: null,
    action: "create",
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
      author: "",
      createdDate: `"${Date.now()}"`,
    },
    EN: {
      title: "",
      description: "",
      author: "",
      createdDate: `"${Date.now()}"`,
    },
    RU: {
      title: "",
      description: "",
      author: "",
      createdDate: `"${Date.now()}"`,
    },
    editData: null,
    headers: [],
    data: [],
    dialog: false,
  }),
  head: {
    title: "Nanonet Service",
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
        `https://consultingweb.duckdns.org/api/v1/blog/create?lang=${this.$t(
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
        `https://consultingweb.duckdns.org/api/v1/blog/list?lang=${this.$t(
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
          this.data = d.data.content;
        })
        .catch((err) => {
          this.errorField = err.message;

          setTimeout(() => {
            this.errorField = null;
          }, 2000);
        });
    },
    handleEditBlog() {
      this.editData = [];
      this.dialog = false;
      this.action = "create";
    },
    editBlog(item) {
      this.action = "edit";
      this.dialog = true;
      this.editData = {
        title: item.title,
        description: item.description,
        author: item.author,
        createdDate: item.createdDate,
      };
    },

    async deleteBlogRequest(id) {
      return await fetch(
        `https://consultingweb.duckdns.org/api/v1/blog/delete/${id}`,
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
    async deleteBlog(id) {
      this.deleteBlogRequest(id)
        .then((res) => res.json())
        .then((d) => {
          this.data = this.data.filter((blog) => blog.id !== id);
        })
        .catch((err) => console.log(err));
    },
  },

  mounted() {
    this.getInfoToData();
    this.EN.author = JSON.parse(
      localStorage.getItem("user")
    ).data.data.username;
    this.RU.author = JSON.parse(
      localStorage.getItem("user")
    ).data.data.username;
    this.UZ.author = JSON.parse(
      localStorage.getItem("user")
    ).data.data.username;
  },
  beforeMount() {
    this.headers = [
      {
        text: this.$root.$t("blog.dataTable.title"),
        align: "start",
        sortable: false,
        value: "title",
      },
      {
        text: this.$root.$t("blog.dataTable.description"),
        align: "start",
        sortable: false,
        value: "description",
      },
      {
        text: this.$root.$t("blog.dataTable.author"),
        align: "start",
        sortable: false,
        value: "author",
      },
      {
        // text: this.$root.$t("blog.dataTable.createdAt"),
        text: "dede",

        align: "center",
        sortable: false,
        value: "createdDate",
      },
      {
        // text: this.$root.$t("blog.dataTable.action"),
        text: "dede",

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
