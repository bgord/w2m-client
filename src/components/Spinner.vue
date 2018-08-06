<template>
	<div class="spinner" :style="showSpinner" />
</template>

<script>
import requiredify from "requiredify";
export default {
	name: "Spinner",
	props: requiredify({
		loading: Boolean,
	}),
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
	@include absolute($top: 50%, $left: 50%);
	@include size($h: $side-length, $w: $side-length);
	margin: -($side-length) 0 0 (-($side-length / 2));
	border-radius: 50%;
	border: 5px solid $background;
	border-bottom: none;
	animation: rotate 1s infinite;
}
</style>
