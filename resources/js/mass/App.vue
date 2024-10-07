<script setup>
import { markRaw } from 'vue';
import { pageList } from './router';

const { initialPage, initialComponent, resolveComponent } = defineProps([
	'initialPage',
	'initialComponent',
	'resolveComponent'
]);
pageList.length = 0;
pageList.push({
	component: initialComponent ? markRaw(initialComponent) : null,
	page: initialPage,
	id: Math.random()
});
const isServer = typeof window === 'undefined';

if (!isServer) {
	router.init({
		initialPage,
		resolveComponent,
		swapComponent: async (args) => {
			// component.value = markRaw(args.component);
			// page.value = args.page;
			// key.value = args.preserveState ? key.value : Date.now();
		}
	});
}
</script>
<template>
	<div class="page-list">
		<div v-for="page of pageList" class="page" :key="page.id">
			<component :is="page.component" name="poker" v-bind="page.page.props" />
		</div>
	</div>
</template>
<style scoped>
.page-list {
	position: relative;
}
.page {
	position: relative;
}
</style>
