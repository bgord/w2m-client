<template>
	<div v-if="!loading" class="app-container">
		<SortPane :shouldDisplay="!!data.length" :updateSortHashValue="updateSortHashValue" :sortHashValue="sortHashValue" :noTranslationOnlyValue="noTranslationOnlyValue" :updateNoTranslationOnly="updateNoTranslationOnly" :showModal="showModal" :howManyNotTranslatedWords="howManyNotTranslatedWords" :howManyWords="howManyWords" />
		<ul v-if="data.length" class="view-list" @keyup.up="moveFocus(-1)" @keyup.down="moveFocus(1)" ref="list" tabindex="-1">
			<transition-group name="grow" appear appear-class="grow-enter" appear-active-class="grow-enter-active">
				<li v-for="(word, index) in sortedData" :key="word._id">
					<Word :resource="word" :refresh="refresh" :wordIndex="index" :currentHighlightedIndex="currentHighlightedIndex" :toggleCollapse="toggleCollapse" />
				</li>
			</transition-group>
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

export default {
	name: "List",
	props: {
		...requiredify({
			loading: Boolean,
			refresh: Function,
			showModal: Function,
		}),
		data: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	data() {
		return {
			sortHashValue: "default",
			noTranslationOnlyValue: false,
			sorter: () => {},
			currentHighlightedIndex: -1,
		};
	},
	methods: {
		updateSortHashValue(e) {
			this.sortHashValue = e.target.value;
		},
		updateNoTranslationOnly(e) {
			this.noTranslationOnlyValue = e.target.checked;
		},
		toggleCollapse(wordIndex) {
			if (this.currentHighlightedIndex === wordIndex) {
				this.currentHighlightedIndex = -1;
				return;
			}
			this.currentHighlightedIndex = wordIndex;
		},
		moveFocus(dir) {
			if (this.currentHighlightedIndex === -1 && dir === -1) {
				return;
			}
			if (
				this.currentHighlightedIndex === this.howManyWords - 1 &&
				dir === 1
			) {
				return;
			}
			this.currentHighlightedIndex += dir;
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
		howManyWords() {
			return this.data.length;
		},
		howManyNotTranslatedWords() {
			return this.data.filter(word => !word.translation).length;
		},
	},
	mounted() {
		setTimeout(() => this.$refs.list.focus(), 1000);
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

.grow-enter {
	opacity: 0;
	transform: scale(0.9);
}

.grow-enter-active {
	transition: all 1s;
}

.grow-move {
	transition: transform 0.5s;
}
</style>
