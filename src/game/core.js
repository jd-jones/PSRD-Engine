var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;

var Utils = require('./utils.js');
var Conditions = require('./conditions.js');
var Tags = require('./tags.js');
var Variables = require('./variables.js');
var Modifiers = require('./modifiers.js');
var Names = require('./names.js');
var Rules = require('../models/rules.js');

module.exports.createRenderable = function(context) {
	var renderable = {
		"context": context.clone(),
		"variables": {},
		"tags": context.get('tags'),
		"applied": [],
		"name": [context.get('name')]
	}
	renderable.context.set('guid', Utils.guid());
	_.each(context.variables(), function(variable, varName) {
		Variables.addVariable(renderable, variable, varName);
	});
	if (context.has('dependencies')) {
		_.each(context.get('dependencies'), function(dependency) {
			applyGameObjects(renderable, Rules.getRule(dependency));
		});
	}
	return renderable;
}

var applyGameObjects = module.exports.applyGameObjects = function() {
	var args = Array.prototype.slice.call(arguments);
	var renderable = args.shift();
	
	_.each(args, function(realobj) {
		var gameobj = realobj.clone();
		gameobj.guid = Utils.guid();
		if (gameobj.has('apply')) {
			var type = renderable.context.get('type');
			var subtype = renderable.context.get('subtype');
			if(type in gameobj.get('apply')) {
				apply(renderable, gameobj.get('apply')[type], gameobj)
			}
			if(renderable.context.get('subtype') in gameobj.get('apply')) {
				apply(renderable, gameobj.get('apply')[subtype], gameobj)
			}
			renderable.applied.push(gameobj);
			if (gameobj.has('dependencies')) {
				_.each(gameobj.get('dependencies'), function(dependency) {
					applyGameObjects(renderable, Rules.getRule(dependency));
				});
			}
		}
	});
	return renderable;
}

function apply(renderable, applications, gameobj) {
	var results = Conditions.apply(renderable, applications)
	if(!results.result) {
		return results;
	}
	Tags.apply(renderable, applications);
	Variables.apply(renderable, applications);
	Modifiers.apply(renderable, applications, gameobj);
	Names.apply(renderable, applications);
}

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
