var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;

var Api = require('./api.js');
var Render = require('./utils/render.js');
var Rules = require('./models/rules.js');
var Core = require('./game/core.js');
require('./data/data.js');

//alert(eval(variable.get("formula")));
//Render.render(Dice.transitionDie("1d6", -2));
//alert(variable.formula(Api, context, this));
var renderable = Core.createRenderable(Rules.getRule("pfsrd://Ultimate Equipment/Rules/Arms And Armor/Weapons/Weapon Descriptions/Longsword"));

Core.applyGameObjects(renderable,
	Rules.getRule("pfsrd://Core Rulebook/Rules/Equipment/Weapons/Masterwork Weapons"),
	Rules.getRule("pfsrd://Core Rulebook/Rules/Magic Items/Weapons?plus=3"),
	Rules.getRule("pfsrd://Core Rulebook/Rules/Magic Items/Weapons/Magic Weapon Special Ability Descriptions/Keen"),
	Rules.getRule("pfsrd://Core Rulebook/Rules/Magic Items/Weapons/Magic Weapon Special Ability Descriptions/Flaming"));

console.log(renderable);
