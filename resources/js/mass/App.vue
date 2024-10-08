<script setup>
import { markRaw } from 'vue';
import { pageList, router } from './router';

const { initialPage, initialComponent, resolveComponent } = defineProps([
	'initialPage',
	'initialComponent',
	'resolveComponent'
]);
router.init({
	component: initialComponent ? markRaw(initialComponent) : null,
	page: initialPage,
	resolveComponent
});
const pageAnimEnd = (page) => {
	if (page.lifeState == 'out') {
		pageList.pop();
	}
	if (page.lifeState == 'push') {
		page.lifeState = 'hidden';
	}
};
</script>
<template>
	<div class="page-list">
		<div
			v-for="page of pageList"
			class="page"
			:key="page.page.id"
			:class="{
				'page-in': page.lifeState == 'in',
				'page-out': page.lifeState == 'out',
				'page-push': page.lifeState == 'push',
				'page-pop': page.lifeState == 'pop',
				'page-hidden': page.lifeState == 'hidden'
			}"
			@animationend="pageAnimEnd(page)"
		>
			<component :is="page.component" v-bind="page.page.props" />
		</div>
	</div>
</template>
<style scoped>
.page-list {
	position: relative;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
}
.page {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: #fff;
}
.page-hidden {
	display: none;
}
.page-in {
	animation: pageIn ease 0.3s forwards;
}

@keyframes pageIn {
	from {
		transform: translate3d(100%, 0, 0);
	}
	to {
		transform: translateZ(0);
	}
}
.page-out {
	animation: pageOut ease 0.3s forwards;
}

@keyframes pageOut {
	from {
		transform: translateZ(0);
	}
	to {
		transform: translate3d(100%, 0, 0);
	}
}

.page-push {
	animation: pagePush ease 0.3s forwards;
}

@keyframes pagePush {
	from {
		transform: translateZ(0);
	}
	to {
		transform: translate3d(-30%, 0, 0);
	}
}
.page-pop {
	animation: pagePop ease 0.3s forwards;
}

@keyframes pagePop {
	from {
		transform: translate3d(-30%, 0, 0);
	}
	to {
		transform: translateZ(0);
	}
}
</style>
