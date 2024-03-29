<template>
    <transition name="fade">
        <div class="modal is-active" v-show="active">
            <div class="modal__background" @click="close"/>
            <transition name="slide-up-opacity">
                <div class="modal__content" v-if="active">
                    <div class="card">
                        <div class="card__header">
                            <slot name="header"/>
                            <a class="card__header-icon modal__close" @click="close">
								<span class="icon">
									<FontAwesomeIcon icon="times-circle"/>
								</span>
                            </a>
                        </div>
                        <div class="card__image" v-if="!! $slots.image">
                            <slot name="image"/>
                        </div>
                        <div class="card__content">
                            <slot name="content"/>
                        </div>
                        <footer class="card__footer">
                            <slot name="footer"/>
                        </footer>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
export default {
    name: "BaseModal",
    emits: ['update:active', 'close'],
    props: {
        active: {
            type: Boolean,
            default: false
        },
        width: {
            type: Number,
            default: 600
        },
        routeName: {
            type: String,
            default: null
        },
        manageCloseNavigation: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            backClick: false
        }
    },
    
    mounted() {
        window.addEventListener('popstate', this.hideOnBack);
    },
    
    beforeUnmount() {
        window.removeEventListener('popstate', this.hideOnBack);
    },
    
    methods: {
        close() {
            if (this.routeName !== null && this.manageCloseNavigation) {
                this.$router.back();
            }
            this.$emit('update:active', false);
        },
        hideOnBack() {
            if (this.active) {
                this.backClick = true;
                this.$emit('update:active', false);
            }
        },
    },
    
    watch: {
        active(value) {
            if (value) {
                if (this.routeName !== null) {
                    this.$router.pushRoute(this.routeName);
                }
            } else {
                this.$emit('close', {
                    back: this.backClick
                });
                this.backClick = false;
            }
        }
    }
}
</script>
