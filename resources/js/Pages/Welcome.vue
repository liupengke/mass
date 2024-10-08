<script setup>
import { router } from '../mass';
defineProps({
	laravelVersion: {
		type: String,
		required: true
	},
	phpVersion: {
		type: String,
		required: true
	},
	name: String
});

function greet(event) {
	router.visit('/goods/890');
}
</script>

<template>
	<div class="ms-4">
		<h1 v-text="name"></h1>
		Laravel v{{ laravelVersion }} (PHP v{{ phpVersion }})

		<button @click="greet">Greet</button>
	</div>
</template>
