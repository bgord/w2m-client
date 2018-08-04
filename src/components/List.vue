<template>
    <div v-if="!loading">
        <header>Words</header>
        <ul v-if="data.length">
            <li v-for="word in data" :key="word._id">
                {{ word }}
            </li>   
        </ul>
        <span v-else>
            No active words...
        </span>
    </div>

</template>

<script>
export default {
	name: "List",
	props: ["loading", "data"],
};
</script>

<style>
</style>
