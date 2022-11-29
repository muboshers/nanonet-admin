<template>
  <h1 class="text-red-500">{{ $t("sidebar.blog") }}</h1>
</template>

<script>
export default {
  middleware: "auth",
};
</script>
