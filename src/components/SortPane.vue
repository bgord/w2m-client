<template>
	<div
	    v-if="shouldDisplay"
	    class="sort-pane"
	>
		<div class="sort-pane__content">
			<div>
				<span class="sort-pane__sortby">SORT BY:</span>
				<select
				    class="sort-pane__select"
				    :value="sortHashValue"
				    @change="updateSortHashValue"
				>
					<option
					    selected
					    value="default"
					>
						-- --
					</option>
					<option value="a-asc">A - Z</option>
					<option value="a-desc">Z - A</option>
					<option value="t-min">Min translations</option>
					<option value="t-max">Max translations</option>
				</select>
			</div>
			<div class="sort-pane__checkbox-wrapper">
				<input
				    class="sort-pane__checkbox"
				    type="checkbox"
				    id="noTranslationOnlyValue"
				    :checked="noTranslationOnlyValue"
				    @change="updateNoTranslationOnly"
				/>
				<label
				    class="sort-pane__label"
				    for="noTranslationOnlyValue"
				>
					no translation only
				</label>
			</div>
		</div>
		<button
		    class="sort-pane__cta"
		    @click="showModal"
		>
			PREPARE
		</button>
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
		"showModal",
	],
};
</script>

<style lang="scss">
@import "../base.scss";

.sort-pane {
	@include top-sticky;
	@include b-light-border;
	@include space-between($ai:center);
	padding-left: 1.125rem;
	height: 3rem;
	background: $almost-white;
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
		@include space-between($ai:center);
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
