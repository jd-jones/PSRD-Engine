var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;

item_ac_size = {
	"colossal": -8,
	"gargantuan": -4,
	"huge": -2,
	"large": -1,
	"medium": 0,
	"small": 1,
	"tiny": 2,
	"diminutive": 4,
	"fine": 8
}

module.exports.acSize = function(size) {
	return item_ac_size[size];
}

