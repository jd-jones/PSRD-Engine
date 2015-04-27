var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

var Variable = require('./variable.js');
var ListOperation = require('./list_operation.js');
var Condition = require('./condition.js');
var StringVar = require('./string.js');
var NumberVar = require('./number.js');
var ListVar = require('./list.js');

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
							if (NumberVar.isValid(variable.default)) {
								variables.push(new NumberVar(variable));
							} else if(StringVar.isValid(variable.default)) {
								variables.push(new StringVar(variable));
							} else if(ListVar.isValid(variable.default)) {
								variables.push(new ListVar(variable));
							} else {
								throw "Don't recognize variable type: " + JSON.stringify(variable);
							}
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
							modifier.context = key;
							modifiers.push(new Variable(modifier));
						} else {
							modifiers.push(modifier);
						}
					});
					apply.modifiers = modifiers;
				}
				if ("lists" in apply) {
					var lists = [];
					_.each(apply.lists, function(listOp) {
						if(listOp instanceof ListOperation == false) {
							listOp.context = key;
							lists.push(new ListOperation(listOp));
						} else {
							lists.push(listOp);
						}
					});
					apply.lists = lists;
				}
			});
		}
		this.setUrl(this.get('url'));
	},

	setUrl: function(newurl) {
		var parameters = getUrlParameters(newurl);
		this.set('url', newurl);
		if(parameters) {
			this.set('parameters', parameters);
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
					if ("lists" in apply) {
						_.each(apply.lists, function(listOp) {
							listOp.set('parameters', parameters);
						});
					}
				});
			}
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
