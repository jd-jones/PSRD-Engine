var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;

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
		_.each(this.get("bonuses"), function(bonus) {
			if(Utils.isNumeric(bonus.get('value'))) {
				if(ignore != bonus) {
					if(bonus.get('value') < 0) {
						sum["untyped"] += bonus.get("value");
					} else if (bonus.has('type')) {
						var type = bonus.get('type');
						if (type in sum) {
							if (bonus.get('value') > sum[type]) {
								sum[type] = bonus.get('value');
							}
						} else {
							sum[type] = bonus.get('value')
						}
					} else {
						sum["untyped"] += bonus.get('value');
					}
				}
			} else {
				strValue = bonus.get('value');
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
