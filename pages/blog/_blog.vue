<template>
  <v-row>
    <v-col col="8" v-if="data">
      <nuxt-link :to="localePath('/blog')">{{ $t("sidebar.blog") }}</nuxt-link>

      <div class="mt-5">
        <v-card class="mx-auto my-12">
          <v-img
            height="250"
            :src="
              'http://consultingweb.duckdns.org/api/v1/upload/' + data.image
            "
          />

          <v-card-title>{{ data.title }}</v-card-title>

          <v-card-text>
            <div class="my-4 text-subtitle-1">
              {{ dateFormat(data.createdDate) }}
            </div>
            <div>
              {{ data.description }}
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  head: {
    title: "Nanonet Service",
  },

  data() {
    return {
      data: null,
    };
  },
  methods: {
    async getBlog() {
      const { blog } = this.$route.params;
      await fetch(
        `https://consultingweb.duckdns.org/api/v1/blog/${blog}?lang=${this.$t(
          "lanaguege"
        )}`
      )
        .then((res) => res.json())
        .then((d) => {
          if (d.data) {
            this.data = d.data;
          } else {
            this.$router.push({ name: "blogPage___en", path: "/" });
          }
        })
        .catch((err) => console.log(err.message));
    },

    dateFormat(date) {
      const today = new Date(date);

      return `${today.getDate()}/${
        today.getMonth() + 1
      }/${today.getFullYear()}`;
    },
  },
  mounted() {
    this.getBlog();
  },
};
</script>
