var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

var Utils = require('./utils.js');
var Rules = require('../models/rules.js');
var Conditions = require('./conditions.js');
var Variables = require('./variables.js');
var Lists = require('./lists.js');

var Modifiers = require('./modifiers.js');

module.exports.createRenderable = function(base) {
	var renderable = {
		"base": base.clone(),
		"applied": [],
		"history": [],
		"contexts": [
			"section",
			base.get('type'),
			base.get('subtype')
		]
	}
	applyGameObjects(renderable, base);
	return renderable;
}

var applyGameObjects = module.exports.applyGameObjects = function() {
	var args = Array.prototype.slice.call(arguments);
	var renderable = args.shift();
	
	_.each(args, function(realobj) {
		var toApply = [];
		var gameobj = realobj.clone();
		renderable.history.push(realobj.get('url'));
		
		toApply = toApply.concat(getDependencies(gameobj));

		applyContext(renderable, toApply);
		applyConditions(renderable, toApply);
		applyVariables(renderable, toApply);
		applyLists(renderable, toApply);
		applyModifiers(renderable, toApply);
		applyHousekeeping(renderable, toApply);
	});
	return renderable;
}

function getDependencies(gameobj) {
	var deps = []
	gameobj.guid = Utils.guid();
	deps.push(gameobj);
	if(gameobj.has('dependencies')) {
		_.each(gameobj.get('dependencies'), function(dep) {
			deps = deps.concat(getDependencies(Rules.getRule(dep)))
		});
	}
	return deps;
}

function applyContext(renderable, toApply) {
	_.each(toApply, function(section) {
		if (section.has('apply')) {
			var apply = section.get('apply');
			_.each(apply, function(context, name) {
				if('context' in context) {
					if(context.context) {
						renderable.contexts.push(name);
					}
				}
			});
		}
	});
}

function applyConditions(renderable, toApply) {
	failures = [];
	iterateApplications(renderable, toApply, function(section, context, apply) {
		var applications = apply[context];
		var results = Conditions.apply(renderable, applications);
		if(!results.result) {
			failures = failures.concat(results.failed);
		}
	});
	if (failures.length > 0) {
		throw "Failed to apply: " + JSON.stringify(failures);
	}
}

function applyVariables(renderable, toApply) {
	iterateApplications(renderable, toApply, function(section, context, apply) {
		var applications = apply[context];
		Variables.apply(renderable, section, applications, context);
	});
}

function applyLists(renderable, toApply) {
	iterateApplications(renderable, toApply, function(section, context, apply) {
		var applications = apply[context];
		Lists.apply(renderable, section, applications, context);
	});
}

function applyModifiers(renderable, toApply) {
	iterateApplications(renderable, toApply, function(section, context, apply) {
		var applications = apply[context];
		Modifiers.apply(renderable, section, applications, context);
	});
}

function applyHousekeeping(renderable, toApply) {
	_.each(toApply, function(section) {
		renderable.applied.push(section);
	});
}

function iterateApplications(renderable, toApply, fxn) {
	_.each(toApply, function(section) {
		if (section.has('apply')) {
			var apply = section.get('apply');
			_.each(renderable.contexts, function(context) {
				if (context in apply) {
					fxn(section, context, apply);
				}
			});
		}
	});
}
//function apply(renderable, applications, gameobj) {
//	var results = Conditions.apply(renderable, applications)
//	if(!results.result) {
//		return results;
//	}
//	Tags.apply(renderable, applications);
//	Variables.apply(renderable, applications);
//	Modifiers.apply(renderable, applications, gameobj);
//	Names.apply(renderable, applications);
//}

// Old
/*
Rules = {
	"addRule": function (section) {
		this[section['url']] = section
	}
}

function getSpellValueConditional(renderable, variable, path, pre, post) {
	var value = getSpellValue(renderable, variable, path);
	if (value) {
		result = "";
		if (pre) {
			result += pre;
		}
		result += value;
		if (post) {
			result += post;
		}
		return result;
	}
	return "";
}
function getSpellValue(renderable, variable, path) {
	var node = jsonPath(renderable, path)[0];
	if (!(path in variable['sources'])) {
		variable['sources'].push(path)
	}
	if (isNumeric(node)) {
		return +node;
	}
	return node;
}

function setSpellValue(spell_renderable, path, field, value) {
	var node = spell_renderable;
	if (path != null) {
		node = jsonPath(spell_renderable, path)[0];
	}
	node[field] = value;
	return value;
}

function updateSpellVariable(renderable, newvar, guid) {
	var name = newvar['variable'];
	var variable = renderable['variables'][name];
	var prevalue = variable['value'];
	if('formula' in newvar) {
		value = eval(newvar['formula']);
		if(isNumeric(value) && isNumeric(variable['value'])) {
			variable['value'] = variable['value'] + value;
		}
		else {
			variable['value'] = value;
		}
		variable['bonus'].push({'value': value, 'guid': guid, "formula": newvar['formula']});
	}
	if (prevalue != variable['value']) {
		propagateUpdates(renderable, '$.variables.' + name + '.value');
	}
	propagateUpdates(renderable, '$.variables.' + name + '.value');
}

function propagateUpdates(renderable, path) {
	forEach(renderable['variables'], function(variable) {
		forEach(variable['sources'], function(source) {
			if(source == path) {
				recalculateSpellVariable(renderable, variable);
			}
		});
	});
}

function recalculateSpellVariable(renderable, variable) {
	var total = 0;
	var prevalue = variable['value'];
	variable['value'] = 0;
	forEach(variable['bonus'], function(bonus) {
		if('formula' in bonus) {
			value = eval(bonus['formula']);
			bonus['value'] = value;
			if(isNumeric(value) && isNumeric(variable['value'])) {
				variable['value'] = variable['value'] + value;
			}
			else {
				variable['value'] = value;
			}
		}
	});
	if (prevalue != variable['value']) {
		propagateUpdates(renderable, '$.variables.' + name + '.value');
	}
}

function createSpellRenderable(spell, character, casting_class, objects) {
	var renderable = {
		"spell": clone(spell),
		"character": clone(character),
		"casting_class": casting_class,
		"variables": {},
		"applied": []
	}
	renderable.spell['guid'] = guid();
	if ('variables' in spell) {
		forEach (spell['variables'], function(variable) {
			var newvar = {"bonus": [], "sources": []}
			if('default' in variable) {
				newvar['value'] = variable['default'];
				newvar['bonus'].push({'value': variable['default'], 'guid': renderable.spell['guid'], "formula": variable['default']});
			}
			if('format' in variable) {
				newvar['format'] = variable['format'];
			}
			if('name' in variable) {
				newvar['name'] = variable['name'];
			}
			renderable['variables'][variable['variable']] = newvar;
			if('formula' in variable) {
				updateSpellVariable(renderable, variable, renderable.spell['guid']);
			}
		});
	}
	return renderable;
}

function applySpellObjects() {
	var args = Array.prototype.slice.call(arguments);
	var renderable = args.shift();
	forEach(args, function(realobj) {
		var gameobj = clone(Rules[realobj]);
		gameobj['guid'] = guid();
		renderable['applied']
		if ('apply' in gameobj && 'spell' in gameobj['apply']) {
			forEach(gameobj['apply']['spell'], function(variable) {
				if(!(variable['variable'] in renderable['variables'])) {
					results = {"bonus": [], "sources": []}
					if('format' in variable) {
						results['format'] = variable['format'];
					}
					if('name' in variable) {
						results['name'] = variable['name'];
					}
					results['value'] = 0;
					renderable['variables'][variable['variable']] = results;
				}
				updateSpellVariable(renderable, variable, gameobj['guid']);
			});
		}
		if (!('sections' in renderable['spell'])) {
			renderable['spell']['sections'] = []
		}
		renderable['spell']['sections'].push(clone(gameobj))
	});
	return renderable;
}

function applyMetamagicFeat(character, existing_spell, feat) {
	var spell = clone(existing_spell);
	if ('apply_to_spell' in feat) {
		if(!("calculation_results" in spell)) {
			spell['calculation_results'] = {}
		}
		forEach(feat['apply_to_spell'], function(field) {
			key = field['key'];
			formula = field['formula'];
			name = field['name'];
			results = {};
			if(key in existing_spell['calculation_results']) {
				results = clone(existing_spell['calculation_results'][key])
			}
			results["value"] = eval(formula);
			results["name"] = name;
			if (!('actors' in results)) {
				results['actors'] = [];
			}
			results['actors'].push({"url": feat['url'], "value": results['value'], "formula": formula});
			spell['calculation_results'][key] = results;
		});
	}
	if (!('sections' in spell)) {
		spell['sections'] = []
	}
	spell['sections'].push(clone(feat))
	return spell;
}
*/
