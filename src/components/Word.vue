<template>
	<div :class="{'word-container': true, uncollapsed: !collapsed}">
		<div class="word__upper">
			<div :style="{'display':'flex', 'align-items': 'center'}">
				<span class="word" v-html="highlightWordInContext" />
				<span class="trans">{{ translation | withParenthesis }}</span>
			</div>
			<button @click="toggleCollapse" class="word__expand">
				{{hideExpandText}}
			</button>
		</div>
		<div v-if="!collapsed" class="word__middle">
			<div>
				<form @submit.prevent="editContext">
					<input v-model="context" :class="{'input':true,'input--changed':hasContextChanged}" ref="context" @keyup.esc="context=''" />
					<button :disabled="editContextPending" :class="{'btnek':true,'btnek--loading': editContextPending}" type="submit">SAVE CONTEXT</button>
				</form>
			</div>
			<form @submit.prevent="editTranslation">
				<input v-model="translation" :class="{'input':true,'input--changed':hasTranslationChanged}" ref="translation" @keyup.esc="translation=''" />
				<button :disabled="editTranslationPending" :class="{'btnek':true,'btnek--loading': editTranslationPending}" type="submit">SAVE TRANSLATION</button>
			</form>
			<div v-if="resource.suggestedTranslations.length" class="sugg-trans__text">
				Suggested translations:
			</div>
			<ul v-if="resource.suggestedTranslations.length" class="sugg-trans__list">
				<li v-for="(suggestion, index) in resource.suggestedTranslations" :key="index" @click="translation = suggestion" class="sugg-trans__item">
					{{ suggestion }}
				</li>
			</ul>
		</div>
		<div class=" word__lower ">
			<div>
				<div :class="{word__badge:true, blurred: !resource.downloadResult} ">{{ MP3Msg }}</div>
				<div :class="{word__badge:true, blurred: !resource.suggestedTranslations.length} ">{{suggestionsMsg}}</div>
			</div>
			<div>
				<button v-if="!collapsed" @click="resetWord" class="word__expand">RESET</button>
				<button v-if="!collapsed" @click="deleteWord" class="delete">DELETE</button>

			</div>
		</div>
	</div>
</template>

<script>
import axios from "axios";

export default {
	name: "Word",
	data() {
		return {
			shouldFocusTrans: false,
			editContextPending: false,
			editTranslationPending: false,
			collapsed: true,
			context: this.resource.context,
			translation: this.resource.translation || "",
			word: this.resource.word,
		};
	},
	props: ["resource", "refresh"],
	methods: {
		toggleCollapse() {
			if (!this.collapsed) {
				this.shouldFocusTrans = false;
			}
			this.collapsed = !this.collapsed;
		},
		async editContext() {
			if (this.editContextPending) {
				return;
			}
			this.shouldFocusTrans = false;
			this.$refs.context.focus();
			if (this.resource.context === this.context) {
				alert("Context hasn't changed.");
				return;
			}
			try {
				this.editContextPending = true;
				await axios.patch(
					"http://localhost:8686/words/" + this.resource._id,
					{
						context: this.context,
					}
				);
				await this.refresh();
			} catch (e) {
				console.error(e);
				alert("Error while updating word...");
			} finally {
				this.editContextPending = false;
			}
		},
		async editTranslation() {
			if (this.editTranslationPending) {
				return;
			}
			this.$refs.translation.focus();
			if (this.resource.translation === this.translation) {
				alert("Translation hasn't changed.");
				return;
			}
			try {
				this.editTranslationPending = true;
				await axios.patch(
					"http://localhost:8686/words/" + this.resource._id,
					{
						translation: this.translation,
					}
				);
				await this.refresh();
			} catch (e) {
				console.error(e);
				alert("Error while updating word...");
			} finally {
				this.editTranslationPending = false;
			}
		},
		async deleteWord() {
			try {
				const result = window.confirm(
					`Delete word "${this.resource.word}"?`
				);
				if (result) {
					await axios.delete(
						"http://localhost:8686/words/" + this.resource._id
					);
					await this.refresh();
				}
			} catch (e) {
				console.error(e);
				alert("Error while updating word...");
			}
		},
		resetWord() {
			this.translation = this.resource.translation || "";
			this.context = this.resource.context;
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
				return "NO SUGGESTED TRANSLATIONS";
			}
			if (arr.length === 1) {
				return "SUGGESTED TRANSLATION";
			}
			return "SUGGESTED TRANSLATIONS";
		},
		hideExpandText() {
			return this.collapsed ? "EXPAND" : "HIDE";
		},
		hasContextChanged() {
			return this.resource.context !== this.context;
		},
		hasTranslationChanged() {
			console.log({
				resource: this.resource.translation,
				this: this.translation,
			});
			return (this.resource.translation || "") !== this.translation;
		},
	},
	filters: {
		withParenthesis: function(translation) {
			if (translation) {
				return `(${translation})`;
			}
			return "";
		},
	},
	updated() {
		if (!this.collapsed && !this.shouldFocusTrans) {
			this.$refs.context.focus();
			this.shouldFocusTrans = true;
			return;
		}
	},
};
</script>

<style lang="scss">
@import "../base.scss";
.word-container {
	background: #fafafa;
	border-left: 3px solid $background;
	border-right: 3px solid $background;
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
	padding-right: 0.5rem;
	&__upper {
		@include space-between;
		align-items: baseline;
	}
	&__lower {
		margin-left: 1rem;
		margin-top: 0.5rem;
		height: 1rem;
		margin-bottom: 0.5rem;
		@include space-between;
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
	height: 1.75rem;
	border: 1px solid #eee;
	width: 20rem;
	padding-left: 0.5rem;
	border-radius: 2px;
	border-left: 2px solid #eee;
	&--changed {
		border-left: 2px solid #4286f4;
	}
}

.btnek {
	@include btn-cta($bc: #4286f4, $fc: $almost-white);
	margin-left: 0;
	height: 1.5rem;
	border-radius: 3px;
	font-size: 12px;
	font-weight: 600;
	&--loading {
		opacity: 0.5;
		box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.3);
		&:hover {
			cursor: auto;
		}
	}
	&:focus {
		@include shadow;
	}
	&:hover {
		opacity: 0.9;
	}
}

.sugg-trans__list {
	margin-top: 6px;
	padding-left: 1rem;
	margin-bottom: 1rem;
	font-size: 13px;
	display: inline-block;
}

.sugg-trans__item {
	color: #444;
	font-style: italic;
	cursor: pointer;
	&:hover {
		opacity: 0.85;
	}
}

.uncollapsed {
	@include light-shadow;
}

.sugg-trans__text {
	@include descriptive-text;
	font-size: 12px;
	padding-top: 16px;
	padding-left: 1rem;
}

.trans {
	padding-top: 2px;
	color: #888;
	font-size: 12px;
}

.delete {
	@include btn-reset;
	height: 1rem;
	margin-top: 1px;
	margin-right: 1rem;
	font-weight: 600;
	color: #e54053;
	letter-spacing: 1px;
}
</style>
