var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

var Utils = require('../game/utils.js');

var Variable = module.exports = Backbone.Model.extend({
	__name__: 'Variable',
	defaults: {
		"default": "",
		"value": null
	},

	getValue: function() {
		var args = Array.prototype.slice.call(arguments);
		var ignore = null;
		_.each(args, function(arg) {
			if ("ignore" in arg) {
				ignore = arg.ignore;
			}
		});
		var strValue = null;
		var sum = {"untyped": 0};
		_.each(this.get("modifiers"), function(modifier) {
			if(Utils.isNumeric(modifier.get('value'))) {
				if(ignore != modifier) {
					if(modifier.get('value') < 0) {
						sum["untyped"] += modifier.get("value");
					} else if (modifier.has('type')) {
						var type = modifier.get('type');
						if (type in sum) {
							if (modifier.get('value') > sum[type]) {
								sum[type] = modifier.get('value');
							}
						} else {
							sum[type] = modifier.get('value')
						}
					} else {
						sum["untyped"] += modifier.get('value');
					}
				}
			} else {
				strValue = modifier.get('value');
			}
		});

		if (strValue != null) {
			return strValue;
		}
		var total = 0;
		_.each(sum, function(inst) {
			total += inst;
		});
		return total;
	},

	formula: function($, renderable) {
		if(!(this.has('formula'))) {
			throw this.get('variable') + " Has no formula";
		}
		this.formula = Function("$", "renderable", "return " + this.get("formula"));
		return this.formula($, renderable);
	}
});
