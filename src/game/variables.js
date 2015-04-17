var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;

var Api = require('../api.js');
var Utils = require('./utils.js');
var AppliedVariable = require("../models/applied_variable.js");
var Bonus = require("../models/bonus.js");

var addVariable = module.exports.addVariable = function(renderable, variable, varName) {
	var newvar = variable.toJSON();
	newvar['bonuses'] = [];
	newvar['sources'] = [];
	if(variable.has('default')) {
		newvar.value = variable.get('default');
		if (Utils.isNumeric(variable.get('default'))) {
			newvar['bonuses'].push(new Bonus({
				'value': variable.get('default'),
				'guid': renderable.context.get('guid'),
				'formula': variable.get('default')
			}));
		} else if (variable.get('default') instanceof Array) {
			newvar['bonuses'].push(new Bonus({
				'value': variable.get('default'),
				'guid': renderable.context.get('guid'),
				'formula': JSON.stringify(variable.get('default'))
			}));
		} else {
			newvar['bonuses'].push(new Bonus({
				'value': variable.get('default'),
				'guid': renderable.context.get('guid'),
				'formula': "'" + variable.get('default') + "'"
			}));
		}
	}
	renderable['variables'][varName] = new AppliedVariable(newvar);
	if('formula' in variable) {
		updateVariable(
			renderable, variable, varName, renderable.context.get('guid'));
	}
}

function applyBonus(variable, bonus) {
	if(variable.get('value') == null) {
		variable.set('value', 0);
	}
	if(Utils.isNumeric(bonus.get('value')) && Utils.isNumeric(variable.get('value'))) {
		var sum = {"untyped": 0};
		var total = variable.getValue();
		if(variable.get('value') != total) {
			variable.set('value', total);
		}
	}
	else {
		if(variable.get('value') != bonus.get('value')) {
			variable.set('value', bonus.get('value'));
		}
	}
}

var updateVariable = module.exports.updateVariable = function(renderable, newvar, name, guid) {
	var variable = renderable['variables'][name];
	if(newvar.has('formula')) {
		var value = newvar.formula(Api, renderable);
		var b = {'value': value, 'guid': guid, "formula": newvar.get('formula')};
		if(newvar.has('type')) {
			b.type = newvar.get('type');
		}
		var bonus = new Bonus(b);
		variable.get('bonuses').push(bonus);
		applyBonus(variable, bonus);
	} else if (newvar.has('append')) {
		variable.get('value').push(newvar.get('append'));
	}
}

var recalculateVariable = module.exports.recalculateVariable = function(renderable, variable) {
	var total = 0;
	_.each(variable.get('bonuses'), function(bonus) {
		if(bonus.has('formula')) {
			var value = bonus.formula(Api, renderable);
			if (value != bonus.get('value')) {
				bonus.set('value', value);
				applyBonus(variable, bonus);
			}
		}
	});
}

function addVariableApply(renderable, variable) {
	var name = variable.get("variable");
	if (name in renderable.variables == false) {
		addVariable(renderable, variable, name);
	}
}

module.exports.apply = function(renderable, applications) {
	if("variables" in applications) {
		_.each(applications.variables, function(varApply) {
			if (varApply.operation == "add") {
				addVariableApply(renderable, varApply.variable);
			}
		});
	}
}
