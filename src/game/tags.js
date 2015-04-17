var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;

function add(renderable, apply) {
	renderable.arrays.tags.push(apply["tag"]);
}

function remove(renderable, apply) {
	renderable.arrays.tags = _.without(renderable.arrays.tags, apply["tag"]);
}

module.exports.apply = function(renderable, applications) {
	if("tags" in applications) {
		_.each(applications.tags, function(tagApply) {
			if (tagApply.operation == "add") {
				add(renderable, tagApply);
			} else if (tagApply.operation == "remove") {
				remove(renderable, tagApply);
			}
		});
	}
}
