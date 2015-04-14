var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;

weapon_hp = {
	"Weapon.Light": {"Weapon.Blade": 2, "Weapon.Hafted": {"Material.Haft.Metal": 10, "*": 2}},
	"Weapon.OneHanded": {"Weapon.Blade": 5, "Weapon.Hafted": {"Material.Haft.Metal": 20, "*": 5}},
	"Weapon.TwoHanded": {"Weapon.Blade": 10, "Weapon.Hafted": 10},
	"Weapon.Ranged": 5
}

weapon_hardness = {
	"Weapon.Light": {"Weapon.Blade": 10, "Weapon.MetalHafted": 10, "Weapon.Hafted": 5},
	"Weapon.OneHanded": {"Weapon.Blade": 10, "Weapon.MetalHafted": 10, "Weapon.Hafted": 5},
	"Weapon.TwoHanded": {"Weapon.Blade": 10, "Weapon.Hafted": 5},
	"Weapon.Ranged": 5
}

weapon_break_size_adjust = {
	"colossal": 16,
	"gargantuan": 8,
	"huge": 4,
	"large": 2,
	"medium": 1,
	"small": 0.5,
	"tiny": 0.25,
	"diminutive": 0.125,
	"fine": 0.0625
}

weapon_magic_costs = {
	1: 2000,
	2: 8000,
	3: 18000,
	4: 32000,
	5: 50000,
	6: 72000,
	7: 98000,
	8: 128000,
	9: 162000,
	10: 200000
}

module.exports.hitPoints = function(tags, size) {
	var medium = tagTreeResolve(tags, weapon_hp, "Weapon Hit Points");
	return Math.ceil(weapon_break_size_adjust[size] * medium);
}

module.exports.hardness = function(tags, size) {
	var medium = tagTreeResolve(tags, weapon_hardness, "Weapon Hardness");
	return Math.ceil(weapon_break_size_adjust[size] * medium);
}

module.exports.magicCostPlus = function(plus) {
	return weapon_magic_costs[plus];
}

function tagTreeResolve(tags, tree, name) {
	var tmpTags = tags.slice(0);
	tmpTags.push("*");
	for (var i = 0; i < tags.length; i++) {
		if(tags[i] in tree) {
			var item = tree[tags[i]];
			if (typeof item === 'object') {
				return tagTreeResolve(tags, item);
			} else {
				return item;
			}
		}
	}
	throw name + "tree does not contain a value for tags";
}

