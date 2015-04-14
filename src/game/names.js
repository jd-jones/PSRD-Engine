var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;

var Api = require('../api.js');

function shift(renderable, apply) {
	renderable.name.shift();
}

function unshift(renderable, apply) {
	renderable.name.unshift(getName(renderable, apply));
}

function push(renderable, apply) {
	renderable.name.push(getName(renderable, apply));
}

function pop(renderable, apply) {
	renderable.name.pop();
}

function insert(renderable, apply) {
	var index = 1;
	if(apply.has("index")) {
		index = apply.get('index');
	}
	renderable.name.splice(index, 0, getName(renderable, apply));
}

function remove(renderable, apply) {
	renderable.name = _.without(renderable.name, getName(renderable, apply));
}

function getName(renderable, apply) {
	if (apply.has('name')) {
		return apply.get('name');
	} else if (apply.has('formula')) {
		return apply.formula(Api, renderable);
	}
	throw "Name apply has neither a name or a formula";
}

module.exports.apply = function(renderable, applications) {
	if("name" in applications) {
		_.each(applications.name, function(nameApply) {
			if (nameApply.get('operation') == "shift") {
				shift(renderable, nameApply);
			} else if (nameApply.get('operation') == "unshift") {
				unshift(renderable, nameApply);
			} else if (nameApply.get('operation') == "push") {
				push(renderable, nameApply);
			} else if (nameApply.get('operation') == "pop") {
				pop(renderable, nameApply);
			} else if (nameApply.get('operation') == "remove") {
				remove(renderable, nameApply);
			} else if (nameApply.get('operation') == "insert") {
				insert(renderable, nameApply);
			}
		});
	}
}
