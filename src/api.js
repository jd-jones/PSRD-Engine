var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;
var JSONPath = require('JSONPath');

var Dice = require('./api/dice.js');
var Utils = require('./game/utils.js');
var Variables = require('./game/variables.js');

module.exports.Dice = Dice;
module.exports.Item = require('./api/item.js');
module.exports.Weapon = require('./api/weapon.js');

module.exports.min = _.min;
module.exports.max = _.max;

module.exports.floor = function(num) {
	return Math.floor(num);
}

module.exports.ceil = function(num) {
	return Math.ceil(num);
}

module.exports.hasTag = function(renderable, tag) {
	var result = _.indexOf(renderable.arrays.tags, tag) > -1;
	return result
}

module.exports.getVariable = function(renderable, variable, path) {
	var node = JSONPath.eval(renderable, path)[0];
	if(!(node)) {
		return 0;
	}
	if(variable.__name__ == "Variable") {
		// To prevent the event being re-added on recalculation.  In that
		// instance, variable comes in as the Bonus, not the original variable
		node.on("change:value", function() {
			var realvar = renderable.variables[this.get('variable')]
			Variables.recalculateVariable(renderable, realvar);
		}, variable);
	}
	var value = node.getValue();
	if(variable.__name__ == 'Bonus') {
		// Prevents infinite increment
		value = node.getValue({"ignore": variable});
	}
	if (Utils.isNumeric(value)) {
		return +value;
	}
	return value;
}

module.exports.getTags = function(renderable) {
	return renderable.arrays.tags;
}

module.exports.getUrlArg = function(modifier, arg) {
	if (modifier.has('parameters')) {
		var params = modifier.get('parameters');
		if (arg in params) {
			var arg = params[arg];
			if (Utils.isNumeric(arg)) {
				return parseInt(arg);
			}
			return arg;
		}
	}
	throw arg + " not in modifier";
}
