<template>
  <v-row>
    <v-col class="mt-5 col-12 overflow-hidden">
      <v-data-table :headers="headers" v-if="data.length > 0" :items="data">
        <template #item.name="{ value, item }">
          <span>
            {{ value }}
          </span>
        </template>

        <template #item.description="{ value, item }">
          <span>
            {{ value }}
          </span>
        </template>

        <template #item.phoneNumber="{ value, item }">
          <span> {{ value }} </span>
        </template>

        <template #item.email="{ value, item }">
          <span>
            {{ value }}
          </span>
        </template>
        <template #item.action="{ item }">
          <v-btn @click="deleteContact(item.id)" color="red" dark class="mx-2">
            <v-icon>mdi-delete</v-icon>
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

<script>
export default {
  name: "ContactPage",
  data() {
    return {
      data: [],
      headers: null,
    };
  },

  methods: {
    async getAllContactInformation() {
      return fetch(
        "https://consultingweb.duckdns.org/api/v1/application/list",
        {
          headers: {
            AUTHORIZATION: `Bearer ${
              JSON.parse(localStorage.getItem("user")).data.token
            }`,
          },
        }
      )
        .then((res) => res.json())
        .then((d) => (this.data = d.data.content))
        .catch((err) => console.log(err));
    },

    async deleteContact(id) {
      await fetch(
        `https://consultingweb.duckdns.org/api/v1/application/delete/   ${id}`,
        {
          method: "DELETE",
          headers: {
            AUTHORIZATION: `Bearer ${
              JSON.parse(localStorage.getItem("user")).data.token
            }`,
          },
        }
      )
        .then((res) => res.json())
        .then((d) => {
          this.data = this.data.filter((d) => d.id !== id);
        })
        .catch((err) => console.log(err.message));
    },
  },

  mounted() {
    this.getAllContactInformation();
  },

  beforeMount() {
    this.headers = [
      {
        text: this.$root.$t("contactPage.dataTable.name"),
        align: "start",
        sortable: false,
        value: "fullName",
        width: 200,
      },
      {
        text: this.$root.$t("contactPage.dataTable.description"),
        align: "start",
        sortable: false,
        width: 200,
        value: "description",
      },
      {
        text: this.$root.$t("contactPage.dataTable.phoneNumber"),
        align: "center",
        sortable: false,
        width: 200,
        value: "phoneNumber",
      },
      {
        text: this.$root.$t("contactPage.dataTable.email"),
        align: "center",
        sortable: false,
        width: 200,
        value: "email",
      },
      {
        text: this.$root.$t("contactPage.dataTable.action"),
        align: "center",
        sortable: false,
        value: "action",
        width: 180,
      },
    ];
  },
};
</script>
