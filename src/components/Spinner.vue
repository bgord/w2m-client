<template>
	<div
	    class="spinner"
	    :style="showSpinner"
	/>
</template>

<script>
export default {
	name: "Spinner",
	props: ["loading"],
	computed: {
		showSpinner: function() {
			return { display: this.loading ? "block" : "none" };
		},
	},
};
</script>


<style lang="scss" scoped>
@import "../base.scss";
.spinner {
	$side-length: 64px;
	position: absolute;
	top: 50%;
	left: 50%;
	margin-top: -($side-length);
	margin-left: -($side-length / 2);
	height: $side-length;
	width: $side-length;
	border-radius: 50%;
	border: 5px solid $background;
	border-bottom: none;
	animation: rotate 1s infinite;
}
</style>
