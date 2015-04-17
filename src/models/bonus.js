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

	formula: function($, renderable) {
		this.formula = Function("$", "renderable", "return " + this.get("formula"));
		return this.formula($, renderable);
	}
});
