define(function(require) {

	var ComponentView = require('coreViews/componentView');
	var Adapt = require('coreJS/adapt');

	var Flipper = ComponentView.extend({
		events: {
			"click .flipper-container": "onClick"
		},

		preRender: function() {
			this.model.set("_stage", 0);
			this.locked = false;
		},

		postRender: function() {
			var $items = this.$(".flipper-item");
			var numItems = $items.length;
			_.each($items, function(el, i) {
				if (i % 2 !== 0) $(el).addClass("back");
			}, this);
			var $clone = $items.eq(0).clone().appendTo($items.parent());
			if (numItems % 2 !== 0) $clone.addClass("back");

			if (this.model.get("width")) this.$(".flipper-container").width(this.model.get("width"));

			this.setItemVisibility();
			this.setReadyStatus();
		},

		setItemVisibility: function() {
			var stage = this.model.get("_stage");
			_.each(this.$(".flipper-item"), function(el, i) {
				var display = stage === i || stage - 1 === i ? "block" : "none";
				el.style.display = display;
			}, this);
		},

		onClick: function() {
			if (this.locked) return;

			this.setLock();

			var stage = this.model.get("_stage") + 1;
			if (stage + 1 === this.model.get("_items").length) {
				this.onComplete();
			} else if (stage === this.model.get("_items").length) {
				this.resetFlipper();
			}

			this.setStage(stage);
		},

		setLock: function() {
			var $flipper = this.$(".flipper");
			$flipper.addClass("animating");
			this.locked = true;
			setTimeout(function() {
				$flipper.removeClass("animating");
				this.locked = false;
			}.bind(this), 600);
		},

		setStage: function(stage) {
			this.model.set("_stage", stage);
			var flipper = this.$(".flipper")[0];
			flipper.className = flipper.className.replace(/stage-\d+/, "stage-" + stage);
			this.setItemVisibility();
		},

		onComplete: function() {
			this.setCompletionStatus();

		},

		resetFlipper: function() {
			setTimeout(function() {
				this.setStage(0);
			}.bind(this), 600);
		}

	});

	Adapt.register('flipper', Flipper);

	return Flipper;

});
