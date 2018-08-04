<template>
    <div class="spinner" :style="show"/>	
</template>

<script>
export default {
	name: "Spinner",
	props: ["loading"],
	computed: {
		show: function() {
			return { display: this.loading ? "block" : "none" };
		},
	},
};
</script>


<style lang="scss" scoped>
@import "../base.scss";
.spinner {
	$side-length: 64px;
	height: $side-length;
	width: $side-length;
	border-radius: 50%;
	border: 5px solid $background;
	border-bottom: none;
	position: absolute;
	top: 50%;
	left: 50%;
	margin-top: -($side-length);
	margin-left: -($side-length / 2);
	animation: rotate 1s infinite;
}

@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>
