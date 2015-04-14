var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;

var Bonus = module.exports = Backbone.Model.extend({
	__name__: 'Bonus',
	defaults: {
		"value": 0,
		"guid": "",
		"formula": ""
	},

	initialize: function() {
		if (this.get("formula") != "") {
			this.formula = Function("$", "renderable", "return " + this.get("formula"));
		}
	}
});
