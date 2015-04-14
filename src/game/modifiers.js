var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;

var Variables = require('./variables.js');

module.exports.apply = function(renderable, applications, gameobj) {
	if("modifiers" in applications) {
		_.each(applications.modifiers, function(modApply) {
			if(modApply.get('variable') in renderable.variables) {
				Variables.updateVariable(renderable, modApply, modApply.get('variable'), gameobj.guid);
			}
		});
	}
}
