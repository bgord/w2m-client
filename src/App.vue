<template>
	<div class="wrapper">
  		<Nav />
		<Spinner :loading="loading" />
		<List :loading="loading" :data="data.response"/>
	</div>
</template>

<script>
import Nav from "./components/Nav";
import Spinner from "./components/Spinner";
import List from "./components/List";
import axios from "axios";

export default {
	name: "app",
	data() {
		return {
			loading: true,
			data: null,
			error: false,
			errorMsg: "",
			header: "Words",
		};
	},
	async created() {
		try {
			const { data } = await axios.get("http://localhost:8787/words");
			this.data = data;
		} catch (e) {
			this.error = false;
			this.errorMsg = "Error while loading words...";
		} finally {
			this.loading = false;
		}
	},
	components: { Nav, Spinner, List },
};
</script>
