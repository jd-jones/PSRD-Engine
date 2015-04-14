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
		if(bonus.has('type')) {
			var max = 0;
			_.each(variable.get("bonuses"), function (existing) {
				if (existing.has('type')) {
					if(existing.get('type') == bonus.get('type')) {
						if (existing.get('value') > max) {
							max = existing.get('value');
						}
					}
				}
			});
			if (bonus.get('value') > max) {
				variable.set('value', variable.get('value') + bonus.get('value') - max);
			}
		}
		else {
			variable.set('value', variable.get('value') + bonus.get('value'));
		}
	}
	else {
		variable.set('value', bonus.get('value'));
	}
}

var updateVariable = module.exports.updateVariable = function(renderable, newvar, name, guid) {
	var variable = renderable['variables'][name];
	var prevalue = variable.get('value');
	if('formula' in newvar) {
		var value = newvar.formula(Api, renderable);
		var b = {'value': value, 'guid': guid, "formula": newvar.get('formula')};
		if(newvar.has('type')) {
			b.type = newvar.get('type');
		}
		var bonus = new Bonus(b);
		applyBonus(variable, bonus);
		variable.get('bonuses').push(bonus);
	} else if (newvar.has('append')) {
		variable.get('value').push(newvar.get('append'));
	}
	if (prevalue != variable.get('value')) {
		propagateUpdates(renderable, '$.variables.' + name + '.value');
	}
	//propagateUpdates(renderable, '$.variables.' + name + '.value');
}

function propagateUpdates(renderable, path) {
	_.each(renderable['variables'], function(variable) {
		_.each(variable.sources, function(source) {
			if(source == path) {
				recalculateVariable(renderable, variable);
			}
		});
	});
}

function recalculateVariable(renderable, variable) {
	var total = 0;
	var prevalue = variable.get('value');
	variable.set('value', 0);
	_.each(variable.get('bonuses'), function(bonus) {
		if(bonus.has('formula')) {
			bonus.set('value', 0);
		}
	});
	_.each(variable.get('bonuses'), function(bonus) {
		if(bonus.has('formula')) {
			value = bonus.formula(Api, renderable);
			bonus.set('value', value);
			applyBonus(variable, bonus);
		}
	});
	if (prevalue != variable.get('value')) {
		propagateUpdates(renderable, '$.variables.' + name + '.value');
	}
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
