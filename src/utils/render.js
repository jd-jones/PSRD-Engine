var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;

module.exports.render = function(renderable) {
	var results = renderName(renderable);
	$('#main').html(results);
}

function renderName(renderable) {
	var results = "";
	var name = renderable.name.join(seperator=" ");
	results += "<h1 class='title-1'>" + name + "</h1>\n";
	return results;
}




// Old code to be converted

module.exports.renderCalculations = function(renderable) {
	$('#calculations').empty();
	if ('variables' in renderable) {
		calculations = "<H2>Calculated Values</H2>\n";
		_.each(renderable.variables, function(variable, name) {
			calculations += "<span class='detail-title'>" + name + ":</span> <span class='detail-value'>";
//			if ('format' in field) {
//				if ('pre' in field['format']) {
//					calculations += field['format']['pre'];
//				}
//			}
			calculations += variable.get('value');
//			if ('format' in field) {
//				if ('post' in field['format']) {
//					calculations += field['format']['post'];
//				}
//			}
			calculations += "<ul>";
			_.each(variable.get('bonuses'), function(bonus) {
				calculations += "<li>";
				var comma = "";
				_.each(bonus.attributes, function(value, key) {
					if (key != 'guid') {
						calculations += comma + key + ": " + value;
				}
					comma = ", ";
				});
				calculations += "</li>\n"
			});
			calculations += "</ul>\n";
			calculations += "</span><br>\n";
		});
		$('#calculations').html(calculations);
	}
}

// Render functions

function renderSection(section, variables, h) {
	var results = "";
	if (section['type'] in renderers) {
		renderer = renderers[section['type']]
		results += renderer.renderHeader(section, variables);
		results += renderer.renderTitle(section, variables, h);
		results += renderer.renderDetails(section, variables);
		results += renderer.renderBody(section, variables);
		results += renderer.renderFooter(section, variables);
		forEach(section['sections'], function(subsection) {
			results += renderSection(subsection, variables, h + 1);
		});
	}
	return results;
}

function renderFieldCalculationResults(section, variables, field_name) {
	if (field_name in variables) {
		field = variables[field_name];
		results = " <span class='calculation-results'>&lt;";
		if ('format' in field) {
			if ('pre' in field['format']) {
				results += field['format']['pre'];
			}
		}
		results += field['value']
		if ('format' in field) {
			if ('post' in field['format']) {
				results += field['format']['post'];
			}
		}
		results += "&gt;</span>";
		return results;
	}
	return "";
}

function renderFieldBasic(section, variables, field_name) {
	if(field_name in section) {
		results = "<span class='detail-title'>" + underToCapital(field_name) + ":</span> <span class='detail-value'>"
			+ section[field_name];
		results += renderFieldCalculationResults(section, variables, field_name);
		results += "</span></br>\n";
		return results
	}
	return "";
}

var defaultRenderHeader = function (section, variables) {
	return "";
};

var defaultRenderTitle = function (section, variables, h) {
	results = "";
	if ('name' in section) {
		results += "<h" + h + " class='title-" + h + "'>" + section['name'] + "</h" + h + ">\n";
	}
	return results;
};

var statBlockRenderTitle = function (section, variables, h) {
	results = "";
	if ('name' in section) {
		results += "\n<p class='stat-block-title'><font color='white'>";
		results += section['name'];
		results += "</font></a></p>\n";
	}
	return results;
};

var defaultRenderDetails = function (section, variables) {
	return "";
};

var defaultRendererBody = function (section, variables) {
	if ('text' in section) {
		return section['text'];
	}
	return "";
};

var defaultRendererFooter = function (section, variables) {
	return "";
};

var renderers = {
	"ability": {
		"renderHeader": defaultRenderHeader,
		"renderTitle": function (section, variables, h) {
			var results = "";
			if ('name' in section) {
				name = section['name'];
				if ('ability_types' in section) {
					name += " (";
					comma = "";
					forEach(section['ability_types'], function(ability_type) {
						name += comma;
						if (ability_type == "Extraordinary") {
							name += "Ex";
						} else if (ability_type == "Supernatural") {
							name += "Su";
						} else if (ability_type == "Spell-Like") {
							name += "Sp";
						}
						comma = ", ";
					});
					name += ")";
				}
				results += "<h" + h + " class='title-" + h + "'>" + name + "</h" + h + ">\n";
			}
			return results;
		},
		"renderDetails": defaultRenderDetails,
		"renderBody": defaultRendererBody,
		"renderFooter": defaultRendererFooter
	},
	"affliction": {
		"renderHeader": defaultRenderHeader,
		"renderTitle": statBlockRenderTitle,
		"renderDetails": function (section, variables) {
			var results = "";
			var contracted = "";
			if ('contracted' in section) {
				contrated = section['subtype'] + ", " + section['contracted'];
			} else {
				contrated = section['subtype'];
			}
			results += "<span class='detail-title'>Contracted:</span> <span class='detail-value'>" + contrated + "</span></br>\n";
			results += renderFieldBasic(section, variables, 'save');
			results += renderFieldBasic(section, variables, 'onset');
			results += renderFieldBasic(section, variables, 'frequency');
			results += renderFieldBasic(section, variables, 'effect');
			results += renderFieldBasic(section, variables, 'initial_effect');
			results += renderFieldBasic(section, variables, 'secondary_effect');
			results += renderFieldBasic(section, variables, 'cure');
			results += renderFieldBasic(section, variables, 'cost');
			if (contracted != null) {
				contracted = subtype + ", " + contracted;
			} else {
				contracted = subtype;
			}
			return results;
		},
		"renderBody": defaultRendererBody,
		"renderFooter": defaultRendererFooter
	},
	"feat": {
		"renderHeader": defaultRenderHeader,
		"renderTitle": defaultRenderTitle,
		"renderDetails": function (section, variables) {
			results = "";
			if ('feat_types' in section) {
				results += "<span class='subtitle'>";
				forEach(section['feat_types'], function(feat_type) {
					results += feat_type + " ";
				});
				results += "</span><br>\n";
			}
			results += renderFieldBasic(section, variables, 'source');
			return results;
		},
		"renderBody": defaultRendererBody,
		"renderFooter": defaultRendererFooter
	},
	"section": {
		"renderHeader": defaultRenderHeader,
		"renderTitle": defaultRenderTitle,
		"renderDetails": defaultRenderDetails,
		"renderBody": defaultRendererBody,
		"renderFooter": defaultRendererFooter
	},
	"spell": {
		"renderHeader": defaultRenderHeader,
		"renderTitle": defaultRenderTitle,
		"renderDetails": function (section, variables) {
			results = "";
			if('school' in section) {
				results += "<span class='detail-title'>School:</span> <span class='detail-value'>" + section['school'];
				if('subschool_text' in section) {
					results += " (" + section['subschool_text'] + ")";
				}
				if('descriptor_text' in section) {
					results += " [" + section['descriptor_text'] + "]";
				}
				results += "</span></br>\n";
			}
			results += "<span class='detail-title'>Level:</span> <span class='detail-value'>";
			first = true;
			forEach(section['level'], function(level) {
				if(!first) {
					results += "; ";
				}
				results += level['class'] + ": " + level.level;
				first = false;
			});
			results += renderFieldCalculationResults(section, variables, 'level');
			results += "</span></br>\n";
			results += renderFieldBasic(section, variables, 'casting_time');
			results += renderFieldBasic(section, variables, 'preparation_time');
			if('component_text' in section) {
				results += "<span class='detail-title'>Components:</span> <span class='detail-value'>" + section['component_text'];
				results += "</span></br>\n";
			}
			results += renderFieldBasic(section, variables, 'range');
			if('effects' in section) {
				forEach(section['effects'], function(effect) {
					results += "<span class='detail-title'>" + effect['name'] + ":</span> <span class='detail-value'>" + effect['text'];
					results += renderFieldCalculationResults(section, variables, effect['name'].toLowerCase());
					results += "</span></br>\n";
				});
			}
			results += renderFieldBasic(section, variables, 'duration');
			results += renderFieldBasic(section, variables, 'saving_throw');
			results += renderFieldBasic(section, variables, 'spell_resistance');
			results += renderFieldBasic(section, variables, 'source');
			if('description' in section) {
				results += "<span class='detail-title'>Summary:</span> <span class='detail-value'>" + section['description'];
				results += "</span></br>\n";
			}
			return results;
		},
		"renderBody": defaultRendererBody,
		"renderFooter": defaultRendererFooter
	},
	"table": {
		"renderHeader": defaultRenderHeader,
		"renderTitle": function (section, variables) {
			return "";
		},
		"renderDetails": defaultRenderDetails,
		"renderBody": defaultRendererBody,
		"renderFooter": defaultRendererFooter
	},
}

// Utility Functions

function underToCapital(string) {
	results = "";
	spstr = string.split("_");
	forEach(spstr, function(word) {
		results += capitalize(word) + " ";
	});
	return results;
}

function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function max(list) {
	return Math.max.apply(null, list);
}

function clone(obj) {
	if(null == obj || "object" != typeof obj) return obj;
	var copy = obj.constructor();
	for(var attr in obj) {
		if(obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
	}
	return copy;
}

function forEach(list, action) {
	for (var i in list) {
		action(list[i]);
	}
}

function isNumeric(num){
	return !isNaN(num)
}
