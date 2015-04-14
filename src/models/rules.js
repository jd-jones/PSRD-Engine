var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;

var RulesObject = Backbone.Model.extend({
	__name__: 'Rules',
	defaults: {
		rules: {}
	},

	addRule: function(gameObj) {
		this.get('rules')[gameObj.get('url')] = gameObj;
	},

	getRule: function(url) {
		if (url.indexOf('?') >-1) {
			var newurl = url.split('?')[0];
			var rule = this.get('rules')[newurl].clone();
			rule.set('url', url);
			return rule;
		}
		return this.get('rules')[url];
	}
});

module.exports = new RulesObject();
