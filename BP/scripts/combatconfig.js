// base attack settings for weapons that arent defined below
export const attackSettings = {
  attackcooldown: 300, // default cooldown between attacks, in milliseconds, overridden by weapon stats
  attackrange: 2, // attack range, overridden by weapon stats
  attackradius: 30, // area radius of attacks in, degree
  attackdelay: 1, // tick delay of damage after attack
  mindmgmult: 0.8, // minimum damage multiplier range
  maxdmgmult: 1.1, // maximum damage multiplier range
  critchance: 1.2, // crit chance % (max 100), overridden by weapons ## leave it to 0
  attacksound: 'dungeonscombat.attack.default',
  attackhitsound: 'dungeonscombat.sweep',
  attacksoundpitch: 0.9 // sound pitch
};

// TODO: make those settings configurable via scoreboard

// advanced settings
export const advancedSettings = {
	healthVisualmultiplier: 1, // multiplier for health & damage indicator values, purely cosmetics. for example, 10 will make health and damage *look* 10 times larger. 20 health will look 200 health, 7 damage will look 70 damage
	families: [ 'mob' ],
  excludedTypes: [ 'player', 'npc' ],
  excludedFamilies: [ 'dchitbox', 'dchitboxride' ]
};
// you can add more types and families for your addons!


// custom weapon config
// add your weapons here!

export const weaponConfig = {
  sword: {
    identifier: "minecraft",
    ids: ["_sword"],
    dmgmult: 1.1,
    critchance: 3,
    cooldown: 400,
    range: 2.6,
    radius: 30,
    delay: 2,
    hitstun: 1,
    knockback: 1,
    weaponsound: 'game.player_mcd.swing',
    weaponhitsound: 'game.player_mcd.cut',
    soundpitch: 1.0,
    swingScript: (world, player) => { // scripts, put null if unneeded
        null
    },
    hitScript: (world, player, target, damage) => {
    	null
    }
  },
  axe: {
    identifier: "minecraft",
    ids: ["_axe"],
    dmgmult: 1.4,
    critchance: 5,
    cooldown: 400,
    range: 2.6,
    radius: 25,
    delay: 2,
    hitstun: 1,
    knockback: 1.1,
    weaponsound: 'game.player_mcd.swing',
    weaponhitsound: 'game.player_mcd.cut',
    soundpitch: 0.8,
    swingScript: (world, player) => { // scripts, put null if unneeded
        null
    },
    hitScript: (world, player, target, damage) => {
    	null
    }
  },
  pickaxe: {
    identifier: "minecraft",
    ids: ["_pickaxe"],
    dmgmult: 1.1,
    critchance: 15,
    cooldown: 600,
    range: 3.1,
    radius: 20,
    delay: 4,
    hitstun: 1,
    knockback: 1.3,
    weaponsound: 'game.player_mcd.swing',
    weaponhitsound: 'game.player_mcd.cut',
    soundpitch: 0.9,
    swingScript: (world, player) => { // scripts, put null if unneeded
        null
    },
    hitScript: (world, player, target, damage) => {
    	null
    }
  },
  trident: {
    identifier: "minecraft",
    ids: ["trident"],
    dmgmult: 1.1,
    critchance: 5,
    cooldown: 500,
    range: 3.5,
    radius: 25,
    delay: 5,
    hitstun: 0.5,
    knockback: 0.8,
    weaponsound: 'game.player_mcd.swing',
    weaponhitsound: 'game.player_mcd.cut',
    soundpitch: 0.9,
    swingScript: (world, player) => { // scripts, put null if unneeded
        null
    },
    hitScript: (world, player, target, damage) => {
    	null
    }
  },
  hoe: {
    identifier: "minecraft",
    ids: ["_hoe"],
    dmgmult: 0.8,
    critchance: 2,
    cooldown: 250,
    range: 2.4,
    radius: 30,
    delay: 2,
    hitstun: 0.5,
    knockback: 1,
    weaponsound: 'game.player_mcd.swing',
    weaponhitsound: 'game.player_mcd.cut',
    soundpitch: 0.9,
    swingScript: (world, player) => { // scripts, put null if unneeded
        null
    },
    hitScript: (world, player, target, damage) => {
    	null
    }
  },
  shovel: {
    identifier: "minecraft",
    ids: ["_shovel"],
    dmgmult: 1.2,
    critchance: 2,
    cooldown: 400,
    range: 2.4,
    radius: 40,
    delay: 3,
    hitstun: 1.5,
    knockback: 1.5,
    weaponsound: 'game.player_mcd.swing',
    weaponhitsound: 'random.anvil_land',
    soundpitch: 0.9,
    swingScript: (world, player) => { // scripts, put null if unneeded
        null
    },
    hitScript: (world, player, target, damage) => {
    	function getRandomFloat(min, max) {
            return Math.random() * (max - min) + min;
        };
    	world.playSound("random.break",player.location,{volume: 2, pitch: getRandomFloat(0.95,1.2)*player.getDynamicProperty('dc_sndptch')}); 
    }
  },
  mace: {
    identifier: "minecraft",
    ids: ["mace"],
    dmgmult: 1.5,
    critchance: 0,
    cooldown: 600,
    range: 2.6,
    radius: 40,
    delay: 3,
    hitstun: 2,
    knockback: 2,
    weaponsound: 'game.player_mcd.swing',
    weaponhitsound: 'mace.smash_air',
    soundpitch: 0.7,
    swingScript: (world, player) => { // scripts, put null if unneeded
       null
    },
    hitScript: (world, player, target, damage) => {
    	let { families, excludedTypes, excludedFamilies } = advancedSettings;
    	 const entities = player.dimension.getEntities({
            maxDistance: 5,
            location: target.location,
            excludeTypes: excludedTypes
        })
        player.dimension.spawnParticle(`minecraft:ice_evaporation_emitter`,target.location)
        player.runCommand('camerashake add @s 0.01 0.5 rotational')
        entities.forEach(entity => {
        	entity.applyImpulse({x: 0, y: 0.5, z: 0})
          })
    }
  },
  example: {
    identifier: "exampleidentifier",
    ids: ["exampletypeid"],
    dmgmult: 1.0,
    critchance: 5,
    cooldown: 400,
    range: 2.8,
    radius: 30,
    delay: 2,
    hitstun: 1,
    knockback: 1,
    weaponsound: 'game.player_mcd.swing',
    weaponhitsound: 'game.player_mcd.cut',
    soundpitch: 1.0,
    swingScript: (world, player) => { // scripts, put null if unneeded
      player.runCommand("say lol") 
    },
    hitScript: (world, player, target, damage) => {
    	player.runCommand(`say i just hit ${target.typeId} for ${Math.floor(damage*10)/10}`)
    }
    },
  example2: {
    identifier: "exampleidentifier",
    ids: ["exampletypeid2"],
    dmgmult: 1.4,
    critchance: 5,
    cooldown: 500,
    range: 2,
    radius: 30,
    delay: 5,
    hitstun: 1,
    knockback: 1,
    weaponsound: 'game.player_mcd.swing',
    weaponhitsound: 'game.player_mcd.cut',
    soundpitch: 0.7,
    swingScript: (world, player) => { // scripts, put null if unneeded
       null
    },
    hitScript: (world, player, target, damage) => {
      const health = player.getComponent('minecraft:health');
      health.setCurrentValue(health.currentValue+(Math.floor(damage)/10))
    }
    } // if youre new to this, dont forget to add ',' next to '}' when youre adding another one!
};