<template>
	<nav class="nav" />
</template>

<script>
export default {
	name: "Nav",
};
</script>

<style lang="scss" scoped>
@import "../base.scss";
.nav {
	@include shadow;
	height: 3rem;
	background: $background;
}
</style>
