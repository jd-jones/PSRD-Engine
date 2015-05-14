var Backbone = require('backbone');
Backbone.$ = require('jquery');
var _ = require('underscore');

var GameObject = require('../models/game_object.js');
var Rules = require('../models/rules.js');

// Longsword
Rules.addRule(new GameObject({
	"body": "<p class=\"stat-block\">This sword is about 3-1/2 feet in length.</p>",
	"name": "Longsword",
	"weight": "4 lbs.",
	"url": "pfsrd://Ultimate Equipment/Rules/Arms And Armor/Weapons/Weapon Descriptions/Longsword",
	"price": "15 gp",
	"misc": {
		"Weapon": {
			"Weapon Class": null,
			"Price": "15 gp",
			"Dmg (S)": "1d6",
			"Proficiency": "One-Handed Melee Weapons",
			"Critical": "19&ndash;20/&times;2",
			"Dmg (M)": "1d8",
			"Dmg (L)": "2d6",
			"Type": "S",
			"Dmg (T)": "1d4"
		}
	},
	"source": "Ultimate Equipment",
	"type": "item",
	"subtype": "weapon",
	"dependencies": [
		"pfsrd://Core Rulebook/Rules/Equipment/Weapons",
		"pfsrd://Core Rulebook/Rules/Combat/Combat Statistics/Attack Bonus/Melee"
	],
	"apply": {
		"section": {
			"sets": [
				{"variable": "tags", "operation": "union", "value": [
						"Weapon",
						"Weapon.Melee",
						"Weapon.OneHanded",
						"Weapon.Martial",
						"Weapon.Slashing",
						"Weapon.Blade",
						"Material.Steel",
						"Material.Metal"
				]}
			],
			"lists": [
				{"variable": "name", "operation": "push", "value": "Longsword"}
			]
		},
		"item": {
			"modifiers": [
				{"variable": "weight", "formula": "4"}
			],
		},
		"weapon": {
			"sets": [
				{"variable": "type", "operation": "add", "value": "slashing"},
				{"variable": "proficiency", "operation": "add", "value": "longsword"},
			],
			"modifiers": [
				{"variable": "cost", "formula": "15"},
				{"variable": "medium_damage", "formula": "'1d8'"},
				{"variable": "crit_range", "formula": "1"},
				{"variable": "crit_mult", "formula": "1"},
				{"variable": "to_hit_modifier", "formula": "0"},
				{"variable": "damage_modifier", "formula": "0"},
				{"variable": "wield_category", "formula": "'OneHanded'"}
			],
		}
	}
}));

// Longbow, Composite
Rules.addRule(new GameObject({
	"body": "<p>You need at least two hands to use a bow, regardless of its size. You can use a composite longbow while mounted. All composite bows are made with a particular strength rating (that is, each requires a minimum Strength modifier to use with proficiency). If your Strength bonus is less than the strength rating of the composite bow, you can't effectively use it, so you take a &ndash;2 penalty on attacks with it. The default composite longbow requires a Strength modifier of +0 or higher to use with proficiency. A composite longbow can be made with a high strength rating to take advantage of an above-average Strength score; this feature allows you to add your Strength bonus to damage, up to the maximum bonus indicated for the bow. Each point of Strength bonus granted by the bow adds 100 gp to its cost. If you have a penalty for low Strength, apply it to damage rolls when you use a composite longbow.</p><p>For purposes of Weapon Proficiency and similar feats, a composite longbow is treated as if it were a longbow.</p>", 
	"name": "Longbow, Composite", 
	"weight": "3 lbs.", 
	"url": "pfsrd://Core Rulebook/Rules/Equipment/Weapons/Weapon Descriptions/Longbow/Composite", 
	"price": "100 gp", 
	"misc": {
		"Weapon": {
			"Weapon Class": "Ranged Weapons", 
			"Dmg (S)": "1d6", 
			"Proficiency": "Martial Weapons", 
			"Range": "110 ft.", 
			"Critical": "&times;3", 
			"Dmg (M)": "1d8", 
			"Dmg (L)": "2d6", 
			"Type": "P", 
			"Dmg (T)": "1d4"
		}
	}, 
	"source": "Core Rulebook", 
	"type": "item",
	"subtype": "weapon",
	"dependencies": [
		"pfsrd://Core Rulebook/Rules/Equipment/Weapons",
		"pfsrd://Core Rulebook/Rules/Combat/Combat Statistics/Attack Bonus/Ranged"
	],
	"apply": {
		"section": {
			"sets": [
				{"variable": "tags", "operation": "union", "value": [
						"Weapon",
						"Weapon.Ranged",
						"Weapon.TwoHanded",
						"Weapon.Martial",
						"Weapon.Piercing",
						"Weapon.Bow",
						"Material.Wood"
				]}
			],
			"lists": [
				{"variable": "name", "operation": "push", "value": "Composite Longbow"}
			]
		},
		"item": {
			"modifiers": [
				{"variable": "weight", "formula": "3"}
			],
		},
		"weapon": {
			"variables": [
				{"variable": "max_strength", "type": "number"}
			],
			"sets": [
				{"variable": "type", "operation": "add", "value": "piercing"},
				{"variable": "proficiency", "operation": "add", "value": "longbow"},
			],
			"modifiers": [
				{"variable": "cost", "formula": "100"},
				{"variable": "cost", "formula": "100 * $.getVariable(renderable, this, '$.weapon.max_strength')"},
				{"variable": "medium_damage", "formula": "'1d8'"},
				{"variable": "crit_mult", "formula": "2"},
				{"variable": "range", "formula": "110"},
				{"variable": "to_hit_modifier", "formula": "0"},
				{"variable": "damage_modifier", "formula": "0"},
				{"variable": "wield_category", "formula": "'Ranged'"},
				{"variable": "damage_modifier", "formula": "$.min([$.getVariable(renderable, this, '$.weapon.max_strength'), $.getVariable(renderable, this, '$.wielder.damage_stat_mod')])"},
			]
		}
	}
}));

