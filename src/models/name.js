var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;

var Name= module.exports = Backbone.Model.extend({
	__name__: 'Name',

	initialize: function() {
		if (this.get("formula") != "") {
			this.formula = Function("$", "renderable", "return " + this.get("formula"));
		}
	}
});

