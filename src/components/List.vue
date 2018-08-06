<template>
	<div v-if="!loading" class="app-container">
		<SortPane :shouldDisplay="!!data.length" :updateSortHashValue="updateSortHashValue" :sortHashValue="sortHashValue" :noTranslationOnlyValue="noTranslationOnlyValue" :updateNoTranslationOnly="updateNoTranslationOnly" :showModal="showModal" />
		<ul v-if="data.length" class="view-list">
			<li v-for="word in sortedData" :key="word._id">
				<Word :resource="word" :refresh="refresh" />
			</li>
		</ul>
		<div v-else class="no-results">
			No active words...
		</div>
	</div>
</template>

<script>
import Word from "./Word";
import SortPane from "./SortPane";
import requiredify from "requiredify";
console.log({ requiredify });
export default {
	name: "List",
	props: requiredify(
		{
			loading: Boolean,
			refresh: Function,
			showModal: Function,
		},
		{
			data: {
				type: Array,
				default: function() {
					return [];
				},
			},
		}
	),
	data() {
		return {
			sortHashValue: "default",
			noTranslationOnlyValue: false,
			sorter: () => {},
		};
	},
	methods: {
		updateSortHashValue: function(e) {
			this.sortHashValue = e.target.value;
		},
		updateNoTranslationOnly: function(e) {
			this.noTranslationOnlyValue = e.target.checked;
		},
	},
	computed: {
		sortedData() {
			const sorters = {
				default: (a, b) =>
					a.context.length < b.context.length ? 1 : -1,
				"a-asc": (a, b) =>
					a.word.toLowerCase() > b.word.toLowerCase() ? 1 : -1,
				"a-desc": (a, b) =>
					a.word.toLowerCase() < b.word.toLowerCase() ? 1 : -1,
				"t-min": (a, b) =>
					a.suggested_translations.length >
					b.suggested_translations.length
						? 1
						: -1,
				"t-max": (a, b) =>
					a.suggested_translations.length >
					b.suggested_translations.length
						? 1
						: -1,
			};
			const filter = this.noTranslationOnlyValue
				? e => !e.translation
				: () => true;
			return this.data.filter(filter).sort(sorters[this.sortHashValue]);
		},
	},
	components: { Word, SortPane },
};
</script>

<style lang="scss">
@import "../base.scss";
.app-container {
	@include full-light-border;
	@include shadow;
	@include stretch-width(45rem);
	margin: 2rem auto;
	min-height: 6rem;
	background: $almost-white;
}
.view-list {
	padding: 1rem;
}
.no-results {
	@include descriptive-text;
	margin: calc(1rem - 2px) 1rem;
}
</style>
