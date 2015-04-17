var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;
var Variable = require('./variable.js');
var Name = require('./name.js');
var Condition = require('./condition.js');

var GameObject = module.exports = Backbone.Model.extend({
	__name__: 'GameObject',
	defaults: {
		"text": "",
		"name": "",
		"source": "",
		"url": "",
		"type": "",
		"subtype": ""
	},

	initialize: function() {
		if (this.has("create")) {
			_.each(this.get("create"), function(create, key) {
				if ("variables" in create) {
					var variables = [];
					_.each(create.variables, function(variable) {
						if(variable instanceof Variable == false) {
							variables.push(new Variable(variable));
						} else {
							variables.push(variable);
						}
					});
					create.variables = variables;
				}
			});
		}
		if (this.has("apply")) {
			_.each(this.get("apply"), function(apply, key) {
				if ("conditions" in apply) {
					var conditions = [];
					_.each(apply.conditions, function(condition) {
						if(condition instanceof Condition == false) {
							conditions.push(new Condition(condition));
						} else {
							conditions.push(condition);
						}
					});
					apply.conditions = conditions
				}
				if ("variables" in apply) {
					var variables = [];
					_.each(apply.variables, function(variable) {
						if(variable instanceof Variable == false) {
							variables.push(new Variable(variable));
						} else {
							variables.push(variable);
						}
					});
					apply.variables = variables;
				}
				if ("modifiers" in apply) {
					var modifiers = [];
					_.each(apply.modifiers, function(modifier) {
						if(modifier instanceof Variable == false) {
							modifiers.push(new Variable(modifier));
						} else {
							modifiers.push(modifier);
						}
					});
					apply.modifiers = modifiers;
				}
				if ("name" in apply) {
					var names = [];
					_.each(apply.name, function(name) {
						if(name instanceof Name == false) {
							names.push(new Name(name));
						} else {
							names.push(name);
						}
					});
					apply.name = names;
				}
			});
		}
		this.setUrl(this.get('url'));
	},

	setUrl: function(newurl) {
		var parameters = getUrlParameters(newurl);
		this.set('url', newurl);
		this.set('parameters', parameters);
		_.each(this.__variables__, function(variable) {
			variable.set('parameters', parameters);
		});
		if (this.has("apply")) {
			_.each(this.get("apply"), function(apply, key) {
				if ("conditions" in apply) {
					_.each(apply.conditions, function(condition) {
						condition.set('parameters', parameters);
					});
				}
				if ("modifiers" in apply) {
					_.each(apply.modifiers, function(modifier) {
						modifier.set('parameters', parameters);
					});
				}
				if ("name" in apply) {
					_.each(apply.name, function(name) {
						name.set('parameters', parameters);
					});
				}
			});
		}
	}
});

function getUrlParameters(url) {
	var parameters = null;
	if(url.indexOf('?') > -1) {
		parameters = {}
		var paramString = url.split('?')[1]
		var urlVariables = paramString.split('&');
		_.each(urlVariables, function(urlVariable) {
			var parameter = urlVariable.split('=');
			parameters[parameter[0]] = parameter[1];
		});
	}
	return parameters;
}
