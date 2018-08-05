<template>
	<div class="blur">
		<div class="prepare-words" @keydown.esc="closeModal" ref="modal" tabindex="-1">
			<div class="close-wrapper">
				<button @click="closeModal" class="prepare-words__close">Close</button>
			</div>
			<code v-html="toHtmlCsv" class="prepare-words__code" />
			<div class="close-wrapper">
				<button :disabled="loading" :class="{'prepare-words__cta':true,'prepare-words__cta--loading': loading}" @click="copyAndArchive">Copy and archive</button>
			</div>
		</div>
	</div>
</template>

<script>
import axios from "axios";
export default {
	name: "PrepareWords",
	props: ["data", "closeModal"],
	data() {
		return {
			loading: false,
		};
	},
	computed: {
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
			} catch (e) {
				alert("Error while archiving.");
				this.loading = false;
			}
		},
	},
	mounted() {
		this.$refs.modal.focus();
	},
};
</script>

<style lang="scss">
@import "../base.scss";
.blur {
	position: absolute;
	background: rgba(0, 0, 0, 0.75);
	width: 100%;
	height: 100%;
}
.close-wrapper {
	display: flex;
	justify-content: flex-end;
	margin: 0.5rem 0;
}
.prepare-words {
	@include shadow;
	position: absolute;
	left: calc(50% - 25rem);
	width: 50rem;
	margin-top: 2rem;
	padding: 1rem;
	border: 4px solid $background;
	background: $almost-white;
	z-index: 4;
	&__close {
		display: block;
		@include btn-reset;
		height: 1rem;
		margin-top: 7px;
		margin-right: 1rem;
		font-weight: 600;
		color: #4286f4;
		letter-spacing: 1px;
	}
	&__cta {
		@include btn-cta($bc: #4286f4, $fc: $almost-white);
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
	}
}
</style>
