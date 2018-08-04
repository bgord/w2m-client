<template>
	<div v-if="data.length" class="sort-pane">
		<span class="sort-pane__sortby">SORT BY:</span>
		<select class="sort-pane__select">
			<option>-- --</option>
			<option>A - Z</option>
			<option>Z - A</option>
			<option>Min translations</option>
			<option>Max translations</option>
		</select>
		<label class="sort-pane__label">
			<input type="checkbox" class="sort-pane__checkbox" /> with context first
		</label>
	</div>
</template>

<script>
export default {
	name: "SortPane",
	props: ["data"],
};
</script>

<style lang="scss">
@import "../base.scss";

.sort-pane {
	display: flex;
	padding-left: 1rem;
	height: 3rem;
	align-items: center;
	border-bottom: 1px solid #eee;
	&__sortby {
		@include label-text;
	}
	&__select {
	}
	&__label {
		@include label-text;
		display: flex;
		align-items: center;
		margin-left: 1rem;
	}
	&__checkbox {
	}
}
</style>
