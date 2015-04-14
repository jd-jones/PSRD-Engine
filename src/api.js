var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;
var JSONPath = require('JSONPath');

var Dice = require('./api/dice.js');
var Utils = require('./game/utils.js');

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
	var result = _.indexOf(renderable.tags, tag) > -1;
	return result
}

module.exports.getVariable = function(renderable, variable, path) {
	var node = JSONPath.eval(renderable, path)[0];
	if(!(node)) {
		return 0;
	}
	if (!(path in node.get('sources'))) {
		node.get('sources').push(path);
	}
	var value = node.get('value');
	if (Utils.isNumeric(value)) {
		return +value;
	}
	return value;
}

module.exports.getTags = function(renderable) {
	return renderable.tags;
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
