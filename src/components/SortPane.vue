<template>
	<div v-if="shouldDisplay" class="sort-pane">
		<div>
			<span class="sort-pane__sortby">SORT BY:</span>
			<select class="sort-pane__select" v-bind:value="sortHashValue" @change="updateSortHashValue">
				<option selected value="default">-- --</option>
				<option value="a-asc">A - Z</option>
				<option value="a-desc">Z - A</option>
				<option value="t-min">Min translations</option>
				<option value="t-max">Max translations</option>
			</select>
		</div>
		<button class="cta">PREPARE</button>
	</div>
</template>

<script>
export default {
	name: "SortPane",
	props: ["shouldDisplay", "sortHashValue", "updateSortHashValue"],
};
</script>

<style lang="scss">
@import "../base.scss";

.sort-pane {
	display: flex;
	justify-content: space-between;
	padding-left: 1.125rem;
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
.cta {
	@include btn-cta($bc: #a8ff8f, $fc: #58aa40);
	height: 1.75rem;
	border-radius: 3px;
	font-size: 12px;
	font-weight: 600;
	&:hover {
		border: 1px solid #eee;
	}
}
</style>
