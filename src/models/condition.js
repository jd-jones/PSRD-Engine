var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;

var Condition = module.exports = Backbone.Model.extend({
	__name__: 'Condition',

	initialize: function() {
		if (this.has("formula")) {
			this.formula = Function("$", "renderable", "return " + this.get("formula"));
		}
	}
});


