var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

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

weapon_cost_adjust = {
	"colossal": 16,
	"gargantuan": 8,
	"huge": 4,
	"large": 2,
	"medium": 1,
	"small": 1,
	"tiny": 0.5,
	"diminutive": 0.25,
	"fine": 0.125
}

weapon_adjust = {
	"colossal": 4,
	"gargantuan": 3,
	"huge": 2,
	"large": 1,
	"medium": 0,
	"small": -1,
	"tiny": -2,
	"diminutive": -3,
	"fine": -4
}

weapon_2x_adjust = {
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

module.exports.sizeCost = function(cost, size) {
	var newCost = weapon_cost_adjust[size] * cost;
	return newCost - cost;
}

module.exports.sizeWeight = function(weight, size) {
	var newWeight = weapon_cost_adjust[size] * weight;
	return newWeight - weight;
}

module.exports.sizeDamage = function(damage, size) {
	var steps = weapon_adjust[size];
	return transitionDie(damage, steps);
}

module.exports.hitPoints = function(renderable, size) {
	var tags = renderable.section.tags.get('value')
	var medium = tagTreeResolve(tags.get(), weapon_hp, "Weapon Hit Points");
	return Math.ceil(weapon_2x_adjust[size] * medium);
}

module.exports.hardness = function(renderable, size) {
	var tags = renderable.section.tags.get('value')
	var medium = tagTreeResolve(tags.get(), weapon_hardness, "Weapon Hardness");
	return Math.ceil(weapon_2x_adjust[size] * medium);
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

/*
- 1 1d2 1d3 1d4 1d6 1d8 2d6 3d6 4d6 6d6 8d6 12d6 ...
... 1d8 1d10 2d6 ...
... 2d6 2d8 3d8 4d8 6d8 8d8 12d8 ...
... 1d10 1d12 3d6 ...
... 1d6 2d4 2d6 ...
... 2d8 2d10 4d8 ...
... 2d10 2d12 6d6 ...

  T     S    M   L   H    G    C
  -     1   1d2 1d3 1d4  1d6  1d8
  1    1d2  1d3 1d4 1d6  1d8  2d6
 1d2   1d3  1d4 1d6 1d8  2d6  3d6
 1d3   1d4  1d6 1d8 2d6  3d6  4d6
 1d4   1d6  1d8 2d6 3d6  4d6  6d6
 1d6   1d8 1d10 2d8 3d8  4d8  6d8
 1d8  1d10 1d12 3d6 4d6  6d6  8d6
 1d4   1d6  2d4 2d6 3d6  4d6  6d6
 1d8  1d10  2d6 3d6 4d6  6d6  8d6
1d10   2d6  2d8 3d8 4d8  6d8  8d8
 2d6   2d8 2d10 4d8 6d8  8d8 12d8
 2d8  2d10 2d12 6d6 8d6 12d6 16d6
*/

die_transitions = {
	"-": ["-", "1"],
	"1": ["-", "1d2"],
	"1d2": ["1", "1d3"],
	"1d3": ["1d2", "1d4"],
	"1d4": ["1d3", "1d6"],
	"1d6": ["1d4", "1d8"],
	"1d8": ["1d6", "2d6"],
	"1d10": ["1d8", "2d8"],
	"1d12": ["1d10", "3d6"],

	"2d4": ["1d6", "2d6"],
	"2d6": ["1d8", "3d6"],
	"2d8": ["2d6", "3d8"],
	"2d10": ["2d8", "4d8"],
	"2d12": ["2d10", "6d6"],

	"3d6": ["2d6", "4d6"],
	"3d8": ["2d8", "4d8"],

	"4d6": ["3d6", "6d6"],
	"4d8": ["3d8", "6d8"],

	"6d6": ["4d6", "8d6"],
	"6d8": ["4d8", "8d8"],

	"8d6": ["6d6", "12d6"],
	"8d8": ["6d8", "12d8"],
}

function transitionDie(die, transition) {
	var new_die = die;
	if(transition >= 0) {
		for(i = 0; i < transition; i++) {
			new_die = die_transitions[new_die][1];
		}
	} else {
		for(i = 0; i > transition; i--) {
			new_die = die_transitions[new_die][0];
		}
	}
	return new_die;
}
