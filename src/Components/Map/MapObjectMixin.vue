<script>
	import leaflet from 'leaflet';

	export default {
		data() {
			return {
				event: 'marker-click',
				eventPayload: {},
				mapObject: null,
				iconSize: 'auto',
				queuedActions: []
			}
		},

		mounted() {
			this.setUp();
			if (this.mapObject) {
				this.addToMap();
				this.runQueuedActions();
			}
		},

		beforeUnmount() {
			this.removeFromMap();
		},

		methods: {
			setUp() {
				this.prepareMapObject();
			},

			prepareMapObject(lat, lng) {
				lat = this.lat;
				lng = this.lng;
				this.mapObject = leaflet.marker([lat, lng], {
					icon: leaflet.divIcon({
						html: this.$el.outerHTML,
						iconSize: [this.iconSize, this.iconSize]
					})
				}).on('click', this.onClick.bind(this));
			},

			runQueuedActions() {
				let action;
				while (action = this.queuedActions.pop()) {
					this[action[0]](...action[1]);
				}
			},

			addToMap() {
				this.$parent.addObject(this.mapObject);
			},
			removeFromMap() {
				this.$parent.removeObject(this.mapObject);
			},
			onClick() {
				this.$emit(this.event, this.payload);
			},

			setIcon(icon) {
				if (this.mapObject) {
					this.mapObject.setIcon(icon);
				} else {
					this.queuedActions.push(['setIcon', [icon]]);
				}
			},

			addClass(addedClass) {
				if (this.mapObject) {
					this.mapObject.getElement().firstChild.classList.add(addedClass);
				} else {
					this.queuedActions.push(['addClass', [addedClass]]);
				}
			},
			removeClass(removedClass) {
				if (this.mapObject) {
					this.mapObject.getElement().firstChild.classList.remove(removedClass);
				} else {
					this.queuedActions.push(['removeClass', [removedClass]]);
				}
			},

			setLatLng(lat, lng) {
				if (this.mapObject) {
					this.mapObject.setLatLng({lat, lng});
				} else {
					this.queuedActions.push(['setLatLng', [lat, lng]]);
				}
			}
		}

	}
</script>
