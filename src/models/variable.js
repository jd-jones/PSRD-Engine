var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;

var Variable = module.exports = Backbone.Model.extend({
	__name__: 'Variable',
	defaults: {
		"name": "",
		"default": "",
		"value": null
	},

	initialize: function() {
		if (this.has("formula")) {
			this.formula = Function("$", "renderable", "return " + this.get("formula"));
		}
	}
});

