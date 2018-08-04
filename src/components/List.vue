<template>
	<div v-if="!loading" class="app-container">
		<div class="space-between view-header__container">
			<header class="view-header">Words ready for Memrise</header>
			<button class="view-header__cta">PREPARE</button>
		</div>
		<SortPane :shouldDisplay="data.length" :updateSortHashValue="updateSortHashValue" />
		<ul v-if="data.length" class="view-list">
			<li v-for="word in sortedData" :key="word._id" class="view-list__item">
				<Word :resource="word" />
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

export default {
	name: "List",
	props: ["loading", "data"],
	data() {
		return {
			sortHashValue: "default",
			sorter: () => {},
		};
	},
	methods: {
		updateSortHashValue: function(e) {
			this.sortHashValue = e.target.value;
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
			return this.data.sort(sorters[this.sortHashValue]);
		},
	},
	components: { Word, SortPane },
};
</script>

<style lang="scss">
@import "../base.scss";
.app-container {
	@include light-border;
	@include shadow;
	margin: 2rem auto;
	max-width: 40rem;
	width: 100%;
	min-height: 6rem;
	background: $almost-white;
}

.view-header {
	@include header-font;
	height: calc(3rem - 1px);
	padding: calc(0.75rem - 2px) 0 0 1rem;
	&__container {
		@include space-between;
		align-items: center;
		background: $background;
	}
	&__cta {
		@include btn-cta($bc: $almost-white, $fc: #666);
		&:hover {
			border: 1px solid #eee;
		}
	}
}

.view-list {
	padding: 1rem;
	&__item {
		@include light-border;
		min-height: 5rem;
		margin-bottom: 1rem;
	}
}

.no-results {
	@include descriptive-text;
	margin: calc(1rem - 2px) 1rem;
}
</style>

