<template>
	<div :class="{'view-item__container': true, 'view-item__container--uncollapsed': !collapsed}">
		<div class="view-item__upper">
			<div class="view-item__upper__container">
				<span class="view-item__upper__context" v-html="highlightWordInContext" />
				<span class="view-item__upper__translation">{{ translation | withParenthesis }}</span>
			</div>
			<transition name="switch" mode="out-in">
				<button @click="toggleCollapse" class="view-item__upper__expand" :key="hideExpandText">
					{{hideExpandText}}
				</button>
			</transition>
		</div>
		<transition name="appear-left" mode="out-in">
			<div v-if=" !collapsed ">
				<form @submit.prevent="editContext">
					<input v-model="context" :class="{ 'view-item__input':true, 'view-item__input--changed':hasContextChanged}" ref="context" @keyup.esc="context=''" />
					<button :disabled="editContextPending" :class="{ 'view-item__submit':true, 'view-item__submit--loading': editContextPending}" type="submit">
						SAVE CONTEXT
					</button>
				</form>
				<form @submit.prevent="editTranslation">
					<input v-model="translation" :class="{ 'view-item__input ':true, 'view-item__input--changed ':hasTranslationChanged}" ref="translation" @keyup.esc="translation=''" />
					<button :disabled="editTranslationPending" :class="{ 'view-item__submit':true, 'view-item__submit--loading': editTranslationPending}" type="submit">
						SAVE TRANSLATION
					</button>
				</form>
				<div v-if="resource.suggestedContexts.length" class="view-item__sugg-items__text">
					Suggested contexts:
				</div>
				<ul v-if="resource.suggestedContexts.length" class="view-item__sugg-items__list">
					<li v-for="(context, index) in resource.suggestedContexts" :key="index" @click="chooseContext(context)" class="view-item__sugg-items__item">
						{{ context }}
					</li>
				</ul>
				<div v-if="resource.suggestedTranslations.length" class="view-item__sugg-items__text">
					Suggested translations:
				</div>
				<ul v-if="resource.suggestedTranslations.length" class="view-item__sugg-items__list">
					<li v-for="(suggestion, index) in resource.suggestedTranslations" :key="index" @click="chooseSugestion(suggestion)" class="view-item__sugg-items__item">
						{{ suggestion }}
					</li>
				</ul>
			</div>
		</transition>
		<div class=" view-item__lower">
			<div>
				<div :class="{ 'view-item__lower__word-badge ':true, 'view-item__lower__word-badge--blurred': !resource.downloadResult}">{{ MP3Msg }}</div>
				<div :class="{ 'view-item__lower__word-badge ':true, 'view-item__lower__word-badge--blurred': !resource.suggestedTranslations.length}">{{suggestionsMsg}}</div>
			</div>
			<div class="view-item__lower__buttons-wrapper">
				<button v-if="!collapsed" @click="resetWord" class="view-item__lower__reset">
					RESET
				</button>
				<button v-if="!collapsed" @click="deleteWord" class="view-item__lower__delete">
					DELETE
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import axios from "axios";
import requiredify from "requiredify";
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
	props: requiredify({
		resource: Object,
		refresh: Function,
	}),
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
		chooseContext(context) {
			this.context = context;
			this.$refs.context.focus();
		},
	},
	computed: {
		highlightWordInContext() {
			const { word, context } = this;
			let ret = context ? context : word;
			return ret.replace(
				word,
				`<span class="view-item__upper__context--highlighted">${word}</span>`
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
.view-item {
	&__container {
		@include normal;
		margin-bottom: 0.5rem;
		padding-bottom: 0.5rem;
		min-height: 3.5rem;
		background: #f6f6f6;
		border-left: 2px solid $background;
		&--uncollapsed {
			@include light-shadow;
		}
	}
	&__upper {
		@include space-between($ai: baseline);
		&__container {
			@include space-between($ai: center);
		}
		&__expand {
			margin: 7px 1rem 0 0;
			@include btn-secondary($c: $blue);
		}
		&__context {
			display: inline-block;
			padding: 3px 0.5rem 0 1rem;
			&--highlighted {
				background: $background;
			}
		}
		&__translation {
			@include descriptive-text($fst: normal);
			padding-top: 2px;
		}
	}
	&__input {
		@include size($h: 1.75rem, $w: 20rem);
		@include full-light-border;
		margin: 1rem 1rem 0 1rem;
		padding-left: 0.5rem;
		border-left: 2px solid #eee;
		border-radius: 2px;
		&--changed {
			border-left: 2px solid $blue;
		}
	}
	&__submit {
		@include btn-cta($bc: $blue, $fc: $almost-white);
		margin-left: 0;
		&--loading {
			@include bta-cta-loading;
		}
	}
	&__sugg-items {
		&__text {
			@include descriptive-text;
			margin-left: 5px;
			padding: 1rem 0 0 1rem;
		}
		&__list {
			display: inline-block;
			margin: 6px auto 1rem 5px;
			padding-left: 1rem;
		}
		&__item {
			@include descriptive-text($c: #555);
			&:hover {
				cursor: pointer;
				opacity: 0.85;
			}
		}
	}
	&__lower {
		@include space-between;
		margin: 0.5rem 0 0.5rem 1rem;
		height: 1rem;
		&__word-badge {
			@include label-text($c: #ab6efe);
			display: inline-block;
			margin-right: 0.5rem;
			padding: 0 0.25rem;
			background: #eee3ff;
			&--blurred {
				opacity: 0.5;
			}
		}
		&__buttons-wrapper {
			margin-top: -5px;
		}
		&__reset {
			@include btn-secondary($c: $blue);
			margin: 7px 1rem 0 0;
		}
		&__delete {
			@include btn-secondary($c: $red);
			margin: 1px 1rem 0 0;
		}
	}
}
.switch-enter-active,
.switch-leave-active {
	transition: all 0.15s;
}
.switch-enter,
.switch-leave-to {
	transform: scale(0.8);
}

.appear-left-enter-active,
.appear-left-leave-active {
	transition: all 0.33s;
}
.appear-left-enter {
	transform: translateY(-20px);
}

.appear-left-leave-to {
	opacity: 0.3;
	transform: translateY(5px);
}
</style>
