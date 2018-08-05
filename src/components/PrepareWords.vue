<template>
	<div class="prepare-words" @click="closeModal">{{ data }} </div>
</template>

<script>
export default {
	name: "PrepareWords",
	props: ["data", "closeModal"],
};
</script>

<style>
</style>
