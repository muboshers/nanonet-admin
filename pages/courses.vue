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
              {{ $t("services.form.category") }}
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
              <template #item.online="{ value, item }">
                <span>
                  {{ value ? "online" : "offline" }}
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
          {{ $t("services.form.category") }}
        </v-card-title>
        <v-card-title
          v-else-if="action === 'edit'"
          class="text-h5 grey lighten-2"
        >
          {{ $t("services.form.category") }}
        </v-card-title>
        <v-card-title v-else class="text-h5 grey lighten-2">
          {{ $t("services.form.category") }}
        </v-card-title>
        <v-form v-model="valid">
          <v-container v-if="action === 'create'">
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="EN.title"
                  :rules="titleRules"
                  :label="$t('services.couses.form.title') + ' EN'"
                  required
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="RU.title"
                  :rules="titleRules"
                  :label="$t('services.couses.form.title') + ' RUS'"
                  required
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="UZ.title"
                  :rules="titleRules"
                  :label="$t('services.couses.form.title') + ' UZB'"
                  required
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4">
                <v-textarea
                  filled
                  v-model="EN.description"
                  :label="$t('services.couses.form.description') + ' ENG'"
                  :rules="descriptionRules"
                  required
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-textarea
                  filled
                  v-model="RU.description"
                  :rules="descriptionRules"
                  :label="$t('services.couses.form.description') + ' RUS'"
                  required
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-textarea
                  filled
                  v-model="UZ.description"
                  :rules="descriptionRules"
                  :label="$t('services.couses.form.description') + ' UZB'"
                  required
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4">
                <v-select
                  :items="enCategories"
                  :label="$t('services.couses.form.type') + ' EN'"
                  outlined
                  item-text="title"
                  :rules="categoryRules"
                  item-value="id"
                  return-object
                  @change="handleENChange"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  :items="ruCategories"
                  :label="$t('services.couses.form.type') + ' RU'"
                  outlined
                  :rules="categoryRules"
                  item-text="title"
                  item-value="id"
                  return-object
                  @change="handleRUChange"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  :items="uzCategories"
                  :label="$t('services.couses.form.type') + ' UZ'"
                  :rules="categoryRules"
                  outlined
                  item-text="title"
                  item-value="id"
                  return-object
                  @change="handleUZChange"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-checkbox
                  v-model="online"
                  label="Online Education"
                  color="primary"
                  :value="true"
                  hide-details
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="date"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="EN.startDate"
                      :label="$t('services.couses.startTime')"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="date" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false">
                      Cancel
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.menu.save(date)">
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-container>

          <!-- edit data form -->
          <v-container v-else-if="action === 'edit'">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  filled
                  v-model="editData.title"
                  :label="$t('category.form.title') + ' ' + $t('lanaguege')"
                  :rules="titleRules"
                  required
                />
                <v-textarea
                  filled
                  v-model="editData.description"
                  :rules="descriptionRules"
                  :label="
                    $t('category.form.description') + ' ' + $t('lanaguege')
                  "
                  required
                />
                <v-select
                  :items="enCategories"
                  :label="$t('services.couses.form.type') + ' UZ'"
                  :rules="categoryRules"
                  outlined
                  item-text="title"
                  item-value="id"
                  return-object
                  @change="handleEditData"
                />
              </v-col>
            </v-row>
          </v-container>
          <v-container else></v-container>
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
import EditIcon from "../components/EditIcon";

export default {
  name: "CoursesPage",
  middleware: "auth",
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
    descriptionRules: [
      (v) => !!v || "Description is required",
      (v) => v.length <= 255 || "Description must be less than 255 characters",
    ],
    categoryRules: [(v) => !!v || "Category is Required"],
    UZ: {
      title: "",
      description: "",
      type: "",
      categoryId: null,
      online: false,
    },
    EN: {
      title: "",
      description: "",
      type: "",
      categoryId: null,
      online: false,
      startDate: "",
    },
    RU: {
      title: "",
      description: "",
      type: "",
      categoryId: null,
      online: false,
    },
    online: false,
    editData: null,
    headers: [],
    data: [],
    dialog: false,
    language: "",
    enCategories: [],
    uzCategories: [],
    ruCategories: [],
  }),
  head: {
    title: "Nanonet About",
  },

  methods: {
    handleENChange(e) {
      const { id, title } = e;
      this.EN.categoryId = id;
      this.EN.type = title;
    },
    handleRUChange(e) {
      const { id, title } = e;
      this.RU.categoryId = id;
      this.RU.type = title;
    },
    handleUZChange(e) {
      const { id, title } = e;
      this.UZ.categoryId = id;
      this.UZ.type = title;
    },

    handleEditData(e) {
      const { id, title } = e;
      this.editData.type = title;
      this.editData.categoryId = id;
    },
    // get all ru and uz and en categoryes from category list
    async getAllCategories(lang, data) {
      await fetch(
        `https://consultingweb.duckdns.org/api/v1/category/list?lang=${lang}`
      )
        .then((res) => res.json())
        .then((d) => {
          this[data] = d.data;
        })
        .catch((err) => console.log(err));
    },

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
        `https://consultingweb.duckdns.org/api/v1/service/edu/create?lang=${this.$t(
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
        `https://consultingweb.duckdns.org/api/v1/service/edu/list?lang=${this.$t(
          "lanaguege"
        )}&categoryId=33`,
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

    getInfoToData() {
      this.getAllblogInformation()
        .then((res) => res.json())
        .then((d) => {
          this.data = d.data;
        })
        .catch((err) => {
          console.log(err.message);
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
        `https://consultingweb.duckdns.org/api/v1/service/edu/delete/${id}`,
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
        `https://consultingweb.duckdns.org/api/v1/service/edu/update/${id}?lang=${this.$t(
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
            EN: this.language === "EN" ? this.editData : null,
            RU: this.language === "RU" ? this.editData : null,
            UZ: this.language === "UZ" ? this.editData : null,
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
    this.getAllCategories("EN", "enCategories");
    this.getAllCategories("RU", "ruCategories");
    this.getAllCategories("UZ", "uzCategories");
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
        text: this.$root.$t("services.couses.form.online"),
        align: "start",
        sortable: false,
        value: "online",
        width: 100,
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

    online() {
      this.EN.online = this.online;
      this.RU.online = this.online;
      this.UZ.online = this.online;
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
</style>
