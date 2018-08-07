<template>
	<div class="wrapper">
		<PrepareWords v-if="showPrepareWordsModal" :closeModal="closeModal" :data="data" :refresh="fetchWords" />
		<Spinner :loading=" loading " />
		<List :loading="loading " :data="data " :refresh="fetchWords " :showModal="showModal " />
	</div>
</template>

<script>
import Spinner from "./components/Spinner";
import List from "./components/List";
import PrepareWords from "./components/PrepareWords";
import axios from "axios";

export default {
	name: "app",
	data() {
		return {
			loading: true,
			data: null,
			error: false,
			errorMsg: "",
			showPrepareWordsModal: false,
		};
	},
	methods: {
		async fetchWords() {
			try {
				const { data } = await axios.get("http://localhost:8686/words");
				this.data = data;
			} catch (e) {
				this.error = false;
				this.errorMsg = "Error while loading words...";
			} finally {
				this.loading = false;
			}
		},
		showModal() {
			this.showPrepareWordsModal = true;
		},
		closeModal(block) {
			if (block) return;
			this.showPrepareWordsModal = false;
		},
	},
	async created() {
		await this.fetchWords();
	},
	components: { Spinner, List, PrepareWords },
};
</script>
