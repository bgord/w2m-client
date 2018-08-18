<template>
	<div v-if="newlyAddedWord.length" @click="clearNotification" class="notification">
		<span class="notification__info">
			Added word:
		</span>
		<span class="notification__word">
			{{ newlyAddedWord }}
		</span>
	</div>
</template>

<script>
import requiredify from "requiredify";
export default {
	name: "Notifiaction",
	props: requiredify({
		newlyAddedWord: String,
		clearNotification: Function,
	}),
};
</script>

<style lang="scss">
@import "../base.scss";
.notification {
	@include fixed($bottom: 2rem, $right: 2rem);
	padding: 0.25rem 1rem;
	height: 2rem;
	background: $green-bg;
	& > * {
		color: $green;
	}
	&__word {
		padding-left: 0.5rem;
		font-weight: 800;
	}
}
</style>
