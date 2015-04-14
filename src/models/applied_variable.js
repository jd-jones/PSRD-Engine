var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;

var Variable = require('./variable.js');

var AppliedVariable = module.exports = Variable.extend({
	__name__: 'AppliedVariable',
	defaults: {
		"bonuses": [],
		"sources": []
	},
});

