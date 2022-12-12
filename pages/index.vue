<template>
  <h1 class="text-red-500">{{ $t("sidebar.blog") }}</h1>
</template>

<script>
export default {
  middleware: "auth",
  name: "HomePage",
  head: {
    title: "Nanonet Home Page",
  },

  mounted() {},
};
</script>
