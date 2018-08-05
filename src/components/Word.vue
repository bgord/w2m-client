<template>
	<div class="word-container">
		<div class="word__upper">
			<span class="word" v-html="highlightWordInContext" />
			<button @click="toggleCollapse" class="word__expand">
				{{hideExpandText}}
			</button>
		</div>
		<div v-if="!collapsed" class="word__middle">
			<div>
				<form @submit.prevent="editContext">
					<input v-model="context" class="input" autofocus />
					<button class="btnek" type="submit">EDIT CONTEXT</button>
				</form>
			</div>
			<form @submit.prevent="editTranslation">
				<input v-model="newTranslation" class="input" />
				<button class="btnek" type="submit">EDIT TRANSLATION</button>
			</form>
			<ul v-if="resource.suggestedTranslations.length">
				<li v-for="(translation, index) in resource.suggestedTranslations" :key="index" @click="newTranslation = translation">
					{{ translation }}
				</li>
			</ul>
		</div>
		<div class=" word__lower ">
			<div :class="{word__badge:true, blurred: !resource.downloadResult} ">{{ MP3Msg }}</div>
			<div :class="{word__badge:true, blurred: !resource.suggestedTranslations.length} ">{{suggestionsMsg}}</div>
		</div>
	</div>
</template>

<script>
import axios from "axios";

export default {
	name: "Word",
	data() {
		return {
			collapsed: true,
			context: this.resource.context,
			newTranslation: this.resource.translation || "",
			word: this.resource.word,
		};
	},
	props: ["resource", "refresh"],
	methods: {
		toggleCollapse() {
			this.collapsed = !this.collapsed;
		},
		async editContext() {
			if (this.resource.context === this.context) {
				alert("Context hasn't changed.");
				return;
			}
			try {
				await axios.patch(
					"http://localhost:8686/words/" + this.resource._id,
					{
						context: this.context,
					}
				);
				alert("Updated!");
				await this.refresh();
			} catch (e) {
				console.error(e);
				alert("Error while updating word...");
			}
		},
		async editTranslation() {
			if (this.resource.translation === this.newTranslation) {
				alert("Translation hasn't changed.");
				return;
			}
			try {
				await axios.patch(
					"http://localhost:8686/words/" + this.resource._id,
					{
						translation: this.newTranslation,
					}
				);
				alert("Updated!");
				await this.refresh();
			} catch (e) {
				console.error(e);
				alert("Error while updating word...");
			}
		},
	},
	computed: {
		highlightWordInContext() {
			const { word, context } = this;
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
	padding-bottom: 0.5rem;
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

.input {
	margin: 1rem 1rem 0 1rem;
	height: 2rem;
	border: 1px solid #eee;
	width: 20rem;
	padding-left: 0.25rem;
}

.btnek {
	@include btn-cta($bc: #4286f4, $fc: $almost-white);
	margin-left: 0;
	height: 1.5rem;
	border-radius: 3px;
	font-size: 12px;
	font-weight: 600;
}
</style>
