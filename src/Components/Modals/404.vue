<template>
    <BaseModal @close="$router.push('/')" route-name="404" v-model:active="active">
        <template #header>
            <p class="card__header-title">404</p>
        </template>
        <template #content>
            <h5 class="four04-wrapper__title">You uncovered Atlantis! Unfortunately it's
                not on our map.</h5>
            <div class="four04-wrapper">
                <img :src="atlantis" class="four04-wrapper__image">
                <img :src="tear" class="four04-wrapper__cover">
            </div>
        </template>
        <template #footer>
            <p class="card__footer-item">
				<span>
					<a @click="$emit('update:active',false)">Take me out of here!</a>
				</span>
            </p>
        </template>
    </BaseModal>
</template>

<script>
import BaseModal from "@/Components/Utilities/BaseModal";
import atlantis from '@/assets/images/atlantis.jpg';
import tear from '@/assets/images/tear.png';

export default {
    name: "NotFound",
    components: {BaseModal},
    emits: ['update:active'],
    
    data() {
        return {
            atlantis,
            tear,
            active: false
        }
    },
    
}
</script>

