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
              {{ $t("blog.title") }}
            </v-btn>
          </v-col>
          <v-col class="mt-5 col-12 overflow-hidden">
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
                <span> {{ value }} </span>
              </template>

              <template #item.createdDate="{ value, item }">
                <span>
                  {{ dateFormat(value) }}
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
                <nuxt-link :to="localePath(`/blog/${item.id}`)">
                  <v-btn class="mx-2">
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                </nuxt-link>
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
          <!-- create form -->
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
                  :label="$t('blog.form.title') + ' UZB'"
                  required
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4">
                <v-textarea
                  filled
                  v-model="EN.description"
                  :label="$t('blog.form.description') + ' ENG'"
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
                  v-model="UZ.description"
                  :rules="descriptionRules"
                  :label="$t('blog.form.description') + ' UZB'"
                  required
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-file-input
                  :label="$t('blog.form.blogImage')"
                  v-model="blogImage"
                  :rules="blogImageRules"
                  truncate-length="15"
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
                  :label="$t('blog.form.title') + ' ' + $t('lanaguege')"
                  :rules="titleRules"
                  required
                />
                <v-textarea
                  filled
                  v-model="editData.description"
                  :rules="descriptionRules"
                  :label="$t('blog.form.description') + ' ' + $t('lanaguege')"
                  required
                />

                <v-file-input
                  :label="$t('blog.form.blogImage')"
                  v-model="blogImage"
                  :rules="blogImageRules"
                  truncate-length="15"
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
            @click="handleEditBlog(id)"
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
import EditIcon from "../../components/EditIcon";
export default {
  middleware: "auth",
  name: "blogPage",
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
      (v) => v.length <= 255 || "Title must be less than 255 characters",
    ],
    blogImageRules: [(v) => !!v || "Blog Image is required"],
    descriptionRules: [
      (v) => !!v || "Description is required",
      (v) => v.length <= 255 || "Description must be less than 255 characters",
    ],
    UZ: {
      title: "",
      description: "",
      author: "",
    },
    EN: {
      title: "",
      description: "",
      author: "",
      image: "",
    },
    RU: {
      title: "",
      description: "",
      author: "",
    },
    blogImage: null,
    editData: null,
    headers: [],
    data: [],
    dialog: false,
    language: "",
    baseURL: "https://consultingweb.duckdns.org/api/v1/upload/",
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
          .catch((err) => console.log(err.message));
        this.dialog = false;
      }
      this.EN.title = "";
      this.EN.description = "";
      this.EN.image = "";

      this.RU.title = "";
      this.RU.description = "";

      this.UZ.title = "";
      this.UZ.description = "";
      this.blogImage = "";
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

    editBlog(item) {
      this.action = "edit";
      this.dialog = true;
      this.id = item.id;
      this.editData = {
        title: item.title,
        description: item.description,
        author: item.author,
        createdDate: item.createdDate || this.EN.createdDate,
        image: item.image,
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

    async updateRequest(id) {
      return await fetch(
        `https://consultingweb.duckdns.org/api/v1/blog/update/${id}?lang=${this.$t(
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
    this.language = this.$root.$t("lanaguege");
    this.headers = [
      {
        text: this.$root.$t("blog.dataTable.title"),
        align: "start",
        sortable: false,
        value: "title",
        width: 100,
      },
      {
        text: this.$root.$t("blog.dataTable.description"),
        align: "start",
        sortable: false,
        value: "description",
        width: 200,
      },
      {
        text: this.$root.$t("blog.dataTable.author"),
        align: "start",
        sortable: false,
        width: 100,
        value: "author",
      },
      {
        text: this.$root.$t("blog.dataTable.createdAt"),
        align: "center",
        sortable: false,
        width: 100,
        value: "createdDate",
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

    async blogImage() {
      if (
        this.blogImage !== null &&
        this.blogImage !== undefined &&
        this.blogImage !== ""
      ) {
        const formData = new FormData();
        formData.append("file", this.blogImage, this.blogImage.name);
        await this.$axios
          .post("https://consultingweb.duckdns.org/api/v1/upload/", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              AUTHORIZATION: `Bearer ${
                JSON.parse(localStorage.getItem("user")).data.token
              }`,
            },
          })
          .then((d) => {
            if (this.editData) {
              this.editData.image = d.data.data;
            } else {
              this.EN.image = d.data.data;
            }
          })
          .catch((err) => console.log(err.message));
      }
    },
  },
};
</script>

<style>
.alert-container {
  position: absolute;
  z-index: 1;
  top: 5%;
}

a {
  text-decoration: none;
}
</style>
