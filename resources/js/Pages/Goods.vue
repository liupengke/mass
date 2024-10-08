<script setup>
import { ref } from 'vue';
import { router } from '../mass';
defineProps(['pid', 'pname', 'img', 'price']);
const goodsId = ref(Math.random());
const visitPage = () => {
	router.visit('/goods/' + goodsId.value);
};

const back = () => router.navigateBack();
</script>

<template>
	<div>
		pid: {{ pid }}
		<hr />
		pname: {{ pname }}
		<hr />
		<img :src="img" width="64" />
		<hr />
		price: ${{ price }}
		<hr />
		<button @click="visitPage">访问 {{ goodsId }}</button>
		<hr />
		<button @click="back">回退</button>
	</div>
</template>
