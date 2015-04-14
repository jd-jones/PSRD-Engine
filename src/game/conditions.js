var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;
var Api = require('../api.js');

module.exports.apply = function(renderable, applications) {
	var results = {"result": true, "failed": []}
	if("conditions" in applications) {
		_.each(applications["conditions"], function(conditionApply) {
			if(!conditionApply.formula(Api, renderable)) {
				results.result = false;
				results.failed.push(conditionApply);
			}
		});
	}
	return results;
}

