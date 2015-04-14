var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;
var Variable = require('./variable.js');
var Condition = require('./condition.js');

var GameObject = module.exports = Backbone.Model.extend({
	__name__: 'GameObject',
	__variables__: {},
	defaults: {
		"text": "",
		"name": "",
		"source": "",
		"url": "",
		"type": "",
		"subtype": "",
		"variables": [],
		"tags": []
	},

	initialize: function() {
		var variables = {}
		_.each(this.get("variables"), function(source) {
			variables[source["variable"]] = new Variable(source)
		});
		this.__variables__ = variables
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
					_.each(apply.variables, function(operation) {
						if (operation.operation == "add") {
							if(operation.variable instanceof Variable == false) {
								operation.variable = new Variable(operation.variable);
							}
						}
					});
				}
				if ("modifiers" in apply) {
					var variables = [];
					_.each(apply.modifiers, function(variable) {
						if(variable instanceof Variable == false) {
							variables.push(new Variable(variable));
						} else {
							variables.push(variable);
						}
					});
					apply.modifiers = variables;
				}
			});
		}
		this.setUrl(this.get('url'));
	},

	variables: function(context) {
		return this.__variables__
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
