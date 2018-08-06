<template>
	<div class="prepare-words__container">
		<div
		    class="prepare-words__modal"
		    @keydown.esc="closeModal(blockClose)"
		    ref="modal"
		    tabindex="-1"
		>
			<div class="prepare-words__modal__upper">
				<div>
					<h4 class="prepare-words__modal__upper__header">Words to archive</h4>
				</div>
				<button
				    @click="closeModal(blockClose)"
				    class="prepare-words__modal__upper__close"
				>
					Close
					</button>
			</div>
			<div class="prepare-words__modal__code">
				<code v-html="toHtmlCsv" />
			</div>
			<div class="prepare-words__modal__cta">
				<button
				    :disabled="loading"
				    :class="{'prepare-words__modal__cta__button':true,'prepare-words__modal__cta__button--loading': loading}"
				    @click="copyAndArchive"
				>Copy and archive</button>
			</div>
	</div>
	</div>
</template>

<script>
import axios from "axios";
export default {
	name: "PrepareWords",
	props: ["data", "closeModal", "refresh"],
	data() {
		return {
			loading: false,
			success: undefined,
		};
	},
	computed: {
		blockClose() {
			return this.loading && !this.success;
		},
		toCsv() {
			return this.data
				.map(e => ({
					context: e.context,
					translation: e.translation,
				}))
				.reduce((acc, curr) => {
					acc += `${curr.context || ""},${curr.translation || ""}\n`;
					return acc;
				}, "");
		},
		toHtmlCsv() {
			return this.data
				.map(e => ({
					context: e.context,
					translation: e.translation,
				}))
				.reduce((acc, curr) => {
					acc += `${curr.context || ""},${curr.translation ||
						""}<br />`;
					return acc;
				}, "");
		},
	},
	methods: {
		async copyAndArchive() {
			this.$copyText(this.toCsv);
			this.loading = true;
			try {
				await Promise.all(
					this.data.map(word =>
						axios.patch("http://localhost:8686/words/" + word._id, {
							archived: true,
							archived_ts: Date.now(),
						})
					)
				);
				this.success = true;
			} catch (e) {
				this.success = false;
				alert("Error while archiving.");
			} finally {
				this.loading = false;
			}
		},
	},
	mounted() {
		this.$refs.modal.focus();
	},
	async beforeDestroy() {
		if (this.success) await this.refresh();
	},
};
</script>

<style lang="scss">
@import "../base.scss";
.prepare-words {
	&__container {
		@include whole-screen;
		@include overlay-bg;
		@include absolute;
	}
	&__modal {
		@include shadow;
		@include stretch-width($w: 50rem);
		@include absolute($left: calc(50% - 25rem));
		margin-top: 1.5rem;
		padding: 1rem;
		background: $almost-white;
		border: 4px solid $background;
		z-index: 4;
		&__upper {
			@include space-between($ai: center);
			margin-bottom: 1rem;
			&__header {
				margin: 0;
			}
			&__close {
				@include btn-secondary($c: $blue);
				display: block;
				margin-right: 1rem;
			}
		}
		&__code {
			@include full-light-border;
			padding: 1rem;
		}
		&__cta {
			@include to-right;
			margin-top: 1.5rem;
			&__button {
				@include btn-cta($bc: $blue, $fc: $almost-white);
				margin-right: 0;
				&--loading {
					@include bta-cta-loading;
				}
			}
		}
	}
}
</style>
