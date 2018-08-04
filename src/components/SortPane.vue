<template>
	<div v-if="shouldDisplay" class="sort-pane">
		<span class="sort-pane__sortby">SORT BY:</span>
		<select class="sort-pane__select" v-model="sortByHash" @input="updateSortHashValue">
			<option selected value="default">-- --</option>
			<option value="a-asc">A - Z</option>
			<option value="a-desc">Z - A</option>
			<option value="t-min">Min translations</option>
			<option value="t-max">Max translations</option>
		</select>
	</div>
</template>

<script>
export default {
	name: "SortPane",
	data: function() {
		return {
			sortByHash: "default",
		};
	},
	props: ["shouldDisplay", "updateSortHashValue"],
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
		margin-left: 0.5rem;
	}
}
</style>
