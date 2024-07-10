// base attack settings for weapons that arent defined below
export const attackSettings = {
  attackcooldown: 300, // default cooldown between attacks, in milliseconds, overridden by weapon stats
  attackrange: 2, // attack range, overridden by weapon stats
  closestentitynumber: 1, // number of closest entities
  attackdelay: 2, // tick delay of damage after attack, this can cause bugs if the number is 0 or too high
  mindmgmult: 0.8, // minimum damage multiplier range
  maxdmgmult: 1.2, // maximum damage multiplier range
  critmultiplier: 1.2, // critical damage multiplier, overridden by weapons ## DON'T SET IT TO 1
  critchance: 0, // crit chance % (max 100), overridden by weapons
  attacksound: 'game.player.attack.nodamage',
  attackhitsound: 'dungeonscombat.attack.default',
  attacksoundpitch: 1.1 // sound pitch
};

// TODO: make those settings configurable via scoreboard

// advanced settings
export const advancedSettings = {
  excludedTypes: ['player', 'item', 'xp_orb'],
  excludedFamilies: ['dchitbox', 'dchitboxride']
};
// you can add more types and families for your addons!


// custom weapon config
// add your weapons here!

// ids: ["_sword"], ## ID of the item, for all the item that includes defined id
// dmgmult: 1.0, ## damage multiplier of the attacks, based on the attack damage of the weapon
// critdmgmult: 2, ## critical damage multiplier
// critchance: 5, ## critical chance %
// cooldown: 400, ## attack cooldown in ms (1000 ms = 1 second)
// range: 2.8, ## range in blocks
// delay: 2, ## damage delay after attacking in ticks (20 ticks = 1 second)
// weaponsound: 'game.player_mcd.swing', ## weapon swing sound
// weaponhitsound: 'game.player_mcd.cut', ## weapon hit sound
// soundpitch: 1.0 ## weapon swing sound pitch


export const weaponConfig = {
  sword: {
    ids: ["_sword"],
    dmgmult: 1.0,
    critdmgmult: 2,
    critchance: 5,
    cooldown: 400,
    range: 2.8,
    delay: 2,
    weaponsound: 'game.player_mcd.swing',
    weaponhitsound: 'game.player_mcd.cut',
    soundpitch: 1.0
  },
  axe: {
    ids: ["_axe"],
    dmgmult: 1.4,
    critdmgmult: 2.5,
    critchance: 5,
    cooldown: 500,
    range: 3.1,
    delay: 5,
    weaponsound: 'game.player_mcd.swing',
    weaponhitsound: 'game.player_mcd.cut',
    soundpitch: 0.7
  },
  pickaxe: {
    ids: ["_pickaxe"],
    dmgmult: 1.1,
    critdmgmult: 1.8,
    critchance: 30,
    cooldown: 600,
    range: 3.5,
    delay: 4,
    weaponsound: 'game.player_mcd.swing',
    weaponhitsound: 'game.player_mcd.cut',
    soundpitch: 0.9
  },
  trident: {
    ids: ["trident"],
    dmgmult: 1.1,
    critdmgmult: 1.5,
    critchance: 5,
    cooldown: 500,
    range: 4.0,
    delay: 5,
    weaponsound: 'game.player_mcd.swing',
    weaponhitsound: 'game.player_mcd.cut',
    soundpitch: 0.9
  }
};