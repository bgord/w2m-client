<template>
	<div class="word-container">
		<div class="word__upper">
			<div class="word" v-html="highlightWordInContext" />
			<button @click="toggleCollapse" class="word__expand">
				{{hideExpandText}}
			</button>
		</div>
		<div class="word__lower">
			<div :class="{word__badge:true, blurred: !resource.downloadResult}">{{ MP3Msg }}</div>
			<div :class="{word__badge:true, blurred: !resource.suggestedTranslations.length}">{{suggestionsMsg}}</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Word",
	data() {
		return { collapsed: true };
	},
	props: ["resource"],
	methods: {
		toggleCollapse() {
			console.log("COM");
			this.collapsed = !this.collapsed;
		},
	},
	computed: {
		highlightWordInContext() {
			const { word, context } = this.resource;
			let ret = context ? context : word;
			return ret.replace(
				word,
				`<span class="word--hightlighted">${word}</span>`
			);
		},
		MP3Msg() {
			return this.resource.downloadResult ? "MP3" : "NO MP3";
		},
		suggestionsMsg: function() {
			const arr = this.resource.suggestedTranslations;
			if (!arr.length) {
				return "NO TRANSLATIONS";
			}
			if (arr.length === 1) {
				return "SUGGESTED TRANSLATION";
			}
			return "SUGGESTED TRANSLATIONS";
		},
		hideExpandText() {
			return this.collapsed ? "EXPAND" : "HIDE";
		},
	},
};
</script>

<style lang="scss">
@import "../base.scss";
.word-container {
	background: #fafafa;
	border-left: 3px solid $background;
	font-weight: 600;
	font-size: 14px;
	min-height: 3.5rem;
	margin-bottom: 1.5rem;
}
.word {
	display: inline-block;
	padding-top: 3px;
	padding-left: 1rem;
	&__upper {
		@include space-between;
	}
	&__lower {
		margin-left: 1rem;
		margin-top: 0.5rem;
		height: 1rem;
		@include left;
	}
	&__badge {
		display: inline-block;
		background: #eee3ff;
		padding: 0 0.25rem;
		color: #ab6efe;
		margin-right: 0.5rem;
		font-size: 12px;
	}
	&--hightlighted {
		background: $background;
	}
	&__expand {
		@include btn-reset;
		height: 1rem;
		margin-top: 7px;
		margin-right: 1rem;
		font-weight: 600;
		color: #4286f4;
		letter-spacing: 1px;
	}
}
.blurred {
	opacity: 0.5;
}
</style>
