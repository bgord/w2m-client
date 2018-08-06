<template>
	<div :class="{'word-container': true, uncollapsed: !collapsed}">
		<div class="word__upper">
			<div :style="{'display':'flex', 'align-items': 'center'}">
				<span
				    class="word"
				    v-html="highlightWordInContext"
				/>
				<span class="trans">{{ translation | withParenthesis }}</span>
			</div>
			<button
			    @click="toggleCollapse"
			    class="word__expand"
			>
				{{hideExpandText}}
				</button>
		</div>
		<div
		    v-if="!collapsed"
		    class="word__middle"
		>
			<div>
				<form @submit.prevent="editContext">
					<input
					    v-model="context"
					    :class="{'input':true,'input--changed':hasContextChanged}"
					    ref="context"
					    @keyup.esc="context=''"
					/>
					<button
					    :disabled="editContextPending"
					    :class="{'btnek':true,'btnek--loading': editContextPending}"
					    type="submit"
					>
						SAVE CONTEXT
						</button>
				</form>
			</div>
			<form @submit.prevent="editTranslation">
				<input
				    v-model="translation"
				    :class="{'input':true,'input--changed':hasTranslationChanged}"
				    ref="translation"
				    @keyup.esc="translation=''"
				/>
				<button
				    :disabled="editTranslationPending"
				    :class="{'btnek':true,'btnek--loading': editTranslationPending}"
				    type="submit"
				>
					SAVE TRANSLATION
					</button>
			</form>
			<div
			    v-if="resource.suggestedTranslations.length"
			    class="sugg-trans__text"
			>
				Suggested translations:
	</div>
	<ul
	    v-if="resource.suggestedTranslations.length"
	    class="sugg-trans__list"
	>
		<li
		    v-for="(suggestion, index) in resource.suggestedTranslations"
		    :key="index"
		    @click="chooseSugestion(suggestion)"
		    class="sugg-trans__item"
		>
			{{ suggestion }}
			</li>
			</ul>
			</div>
			<div class=" word__lower ">
				<div>
					<div :class="{word__badge:true, blurred: !resource.downloadResult} ">{{ MP3Msg }}</div>
					<div :class="{word__badge:true, blurred: !resource.suggestedTranslations.length} ">{{suggestionsMsg}}</div>
				</div>
				<div class="button-wrapper">
					<button
					    v-if="!collapsed"
					    @click="resetWord"
					    class="word__expand"
					>RESET</button>
						<button
						    v-if="!collapsed"
						    @click="deleteWord"
						    class="delete"
						>DELETE</button>

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
			this.$refs.context.focus();
		},
		chooseSugestion(suggestion) {
			this.translation += suggestion;
			this.$refs.translation.focus();
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
	margin-bottom: 1.5rem;
	padding-bottom: 0.5rem;
	min-height: 3.5rem;
	background: #fafafa;
	font-weight: 600;
	font-size: 14px;
	border-left: 3px solid $background;
	border-right: 3px solid $background;
}
.word {
	display: inline-block;
	padding: 3px 0.5rem 0 1rem;
	&__upper {
		@include space-between($ai: baseline);
	}
	&__lower {
		@include space-between;
		margin: 0.5rem 0 0.5rem 1rem;
		height: 1rem;
	}
	&__badge {
		display: inline-block;
		margin-right: 0.5rem;
		padding: 0 0.25rem;
		background: #eee3ff;
		color: #ab6efe;
		font-size: 12px;
	}
	&--hightlighted {
		background: $background;
	}
	&__expand {
		@include btn-reset;
		margin: 7px 1rem 0 0;
		height: 1rem;
		color: $blue;
		letter-spacing: 1px;
		font-weight: 600;
	}
}
.blurred {
	opacity: 0.5;
}

.input {
	margin: 1rem 1rem 0 1rem;
	padding-left: 0.5rem;
	height: 1.75rem;
	width: 20rem;
	border: 1px solid #eee;
	border-left: 2px solid #eee;
	border-radius: 2px;
	&--changed {
		border-left: 2px solid $blue;
	}
}

.btnek {
	@include btn-cta($bc: $blue, $fc: $almost-white);
	margin-left: 0;
	height: 1.5rem;
	font-size: 12px;
	font-weight: 600;
	border-radius: 3px;
	&--loading {
		opacity: 0.5;
		@include strong-shadow;
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
	display: inline-block;
	margin: 6px auto 1rem auto;
	padding-left: 1rem;
}

.sugg-trans__item {
	font-size: 13px;
	color: #555;
	font-style: italic;
	&:hover {
		cursor: pointer;
		opacity: 0.85;
	}
}

.uncollapsed {
	@include light-shadow;
}

.sugg-trans__text {
	@include descriptive-text;
	padding: 1rem 0 0 1rem;
	font-size: 12px;
}

.trans {
	padding-top: 2px;
	color: #888;
	font-size: 12px;
}

.delete {
	@include btn-reset;
	margin: 1px 1rem 0 0;
	height: 1rem;
	font-weight: 600;
	color: #e54053;
	letter-spacing: 1px;
}

.button-wrapper {
	margin-top: -5px;
}
</style>
