<template>
	<div v-if="shouldDisplay" class="sort-pane">
		<div class="sort-pane__content">
			<div>
				<span class="sort-pane__sortby">SORT BY:</span>
				<select class="sort-pane__select" :value="sortHashValue" @change="updateSortHashValue">
					<option selected value="default">-- --</option>
					<option value="a-asc">A - Z</option>
					<option value="a-desc">Z - A</option>
					<option value="t-min">Min translations</option>
					<option value="t-max">Max translations</option>
				</select>
			</div>

			<div class="sort-pane__checkbox-wrapper">
				<input class="sort-pane__checkbox" type="checkbox" id="noTranslationOnlyValue" :checked="noTranslationOnlyValue" @change="updateNoTranslationOnly" />
				<label class="sort-pane__label" for="noTranslationOnlyValue">
					no translation only
				</label>
			</div>
		</div>

		<button class="sort-pane__cta">PREPARE</button>
	</div>
</template>

<script>
export default {
	name: "SortPane",
	props: [
		"shouldDisplay",
		"sortHashValue",
		"updateSortHashValue",
		"updateNoTranslationOnly",
		"noTranslationOnlyValue",
	],
};
</script>

<style lang="scss">
@import "../base.scss";

.sort-pane {
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: sticky;
	top: 0;
	left: 0;
	padding-left: 1.125rem;
	height: 3rem;
	background: $almost-white;
	border-bottom: 1px solid #eee;
	z-index: 3;
	&__content {
		display: flex;
	}
	&__sortby {
		@include label-text;
	}
	&__select {
		margin-left: 0.5rem;
	}
	&__checkbox-wrapper {
		display: flex;
		align-items: center;
	}
	&__label {
		@include label-text;
	}
	&__checkbox {
		margin-left: 1rem;
	}
	&__cta {
		@include btn-cta($bc: #a8ff8f, $fc: #58aa40);
		height: 1.75rem;
		border-radius: 3px;
		font-size: 12px;
		font-weight: 600;
		&:hover {
			border: 1px solid #eee;
		}
	}
}
</style>
