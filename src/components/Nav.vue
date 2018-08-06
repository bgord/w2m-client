<template>
	<nav class="nav">
	</nav>
</template>

<script>
export default {
	name: "Nav",
};
</script>


<style lang="scss" scoped>
@import "../base.scss";
.nav {
	background: $background;
	height: 3rem;
	@include shadow;
}
</style>
