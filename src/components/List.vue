<template>
	<div v-if="!loading" class="app-container">
		<SortPane :shouldDisplay="!!data.length" :updateSortHashValue="updateSortHashValue" :sortHashValue="sortHashValue" :noTranslationOnlyValue="noTranslationOnlyValue" :updateNoTranslationOnly="updateNoTranslationOnly" :showModal="showModal" :howManyNotTranslatedWords="howManyNotTranslatedWords" :howManyWords="howManyWords" />
		<ul v-if="data.length" class="view-list" @keypress.up="moveFocus(-1)" @keypress.down="moveFocus(1)" ref="list" tabindex="-1">
			<transition-group name="grow" appear appear-class="grow-enter" appear-active-class="grow-enter-active">
				<li v-for="(word, index) in sortedData" :key="word._id" :data-index="index">
					<Word :resource="word" :refresh="refresh" :wordIndex="index" :currentHighlightedIndex="currentHighlightedIndex" :toggleCollapse="toggleCollapse" :isCurrentWordDirty="isCurrentWordDirty" :setCurrentWordDirty="setCurrentWordDirty" />
				</li>
			</transition-group>
		</ul>
		<div v-else class="no-results">
			No active words...
		</div>
		<Notification :newlyAddedWord="newlyAddedWord" :clearNotification="clearNotification" />
	</div>
</template>

<script>
import Word from "./Word";
import SortPane from "./SortPane";
import Notification from "./Notification";
import requiredify from "requiredify";
import io from "socket.io-client";
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
			currentHighlightedIndex: -1,
			isCurrentWordDirty: false,
			socket: io("localhost:8686"),
			newlyAddedWord: "",
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
			this.isCurrentWordDirty = false;
			if (this.currentHighlightedIndex === wordIndex) {
				this.currentHighlightedIndex = -1;
				return;
			}
			this.currentHighlightedIndex = wordIndex;
		},
		moveFocus(dir) {
			this.isCurrentWordDirty = false;
			if (this.currentHighlightedIndex === -1 && dir === -1) {
				this.$refs.list.focus();
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
		setCurrentWordDirty() {
			this.isCurrentWordDirty = true;
		},
		clearNotification() {
			this.newlyAddedWord = "";
		},
	},
	computed: {
		sortedData() {
			const sorters = {
				default: (a, b) =>
					a._id < b._id ? 1 : -1,
				"a-asc": (a, b) =>
					a.word.toLowerCase() > b.word.toLowerCase() ? 1 : -1,
				"a-desc": (a, b) =>
					a.word.toLowerCase() < b.word.toLowerCase() ? 1 : -1,
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
		this.socket.on("new-word", word => {
			this.newlyAddedWord = word;
			setTimeout(() => this.clearNotification(), 5000);
			this.refresh();
		});
		setTimeout(() => this.$refs.list.focus(), 1000);
	},
	updated() {
		const curr_elem = document.querySelector(
			`[data-index="${this.currentHighlightedIndex}"]`
		);
		if (!curr_elem) {
			this.$refs.list.focus();
			return;
		}
		window.scrollTo({
			top: this.currentHighlightedIndex * 72 + 40,
			behavior: "smooth",
		});
	},
	components: { Word, SortPane, Notification },
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
	margin-bottom: 10rem;
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
	transform: scale(0.95);
}

.grow-enter-active {
	transition: all 0.33s;
}

.grow-move {
	transition: transform 0.33s;
}
</style>
