import { system, world, EntityDamageCause } from '@minecraft/server'
import { weaponConfig, attackSettings, advancedSettings } from './combatconfig';

// fun fact:
// this took days to make because of bugs

// ################### DON'T TOUCH ANYTHING BELOW! ###################
// ################ UNLESS YOU KNOW WHAT YOU'RE DOING ################
let { attackcooldown, attackrange, closestentitynumber, attackdelay, mindmgmult, maxdmgmult, critmultiplier, critchance, attacksound, attackhitsound, attacksoundpitch } = attackSettings;
let { excludedTypes, excludedFamilies } = advancedSettings;
let dmgnum = 1; // damage used in calculation
let dmg = 1; // defined for actual damage output
let dmgval = 1; // weapon damage calculation
let cooldown = attackcooldown;
let critchnc = critchance;
let critdmgmult = critmultiplier;
let range = attackrange;
let delay = attackdelay;
let sound = attacksound;
let hitsound = attackhitsound;
let sndptch = attacksoundpitch;

world.afterEvents.entityHurt.subscribe(({damage, damageSource, hurtEntity}) => {
    const player = damageSource.damagingEntity;
    const hitbox = hurtEntity;
    if (hitbox.typeId == "dungeonscombat:hitbox" && player.typeId == "minecraft:player" && damageSource.cause == EntityDamageCause.entityAttack ) {
        hitbox.addEffect('fire_resistance',10,{amplifier:0,showParticles:false});
        hitbox.addEffect('regeneration',100,{amplifier:255,showParticles:false});
        dmgnum = damage;
    };
});

world.afterEvents.entityHitEntity.subscribe((hit) => {
    const player = hit.damagingEntity;
    const hitbox = hit.hitEntity;
    const equipment = player.getComponent('equippable'); 
    const item = equipment ? equipment.getEquipment('Mainhand') : undefined;
    //this item check is seriously dirty but i dont know what else to do
    //cuz anything else just breaks the code
    const time = Date.now();
    function getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    };
    function setPl(id, val) {
        player.setDynamicProperty(`${id}`,val);
    };
    function getPl(id) {
        return player.getDynamicProperty(`${id}`);
    };
    if (hitbox.typeId == "dungeonscombat:hitbox" && player.typeId == "minecraft:player") {
        if (!(player['attackcooldown'] > time)) {
        // replace with getComponent 'minecraft:movement' in future
        player.addEffect('slowness',5,{amplifier:9,showParticles:false});
        ////////////////
        system.runTimeout(() => {
            if (item && item.typeId) {
                let hasWeapon = false;
                for (const weapon in weaponConfig) {
                    const wpnconfig = weaponConfig[weapon]
                    if (wpnconfig.ids.some(id => item.typeId.includes(id))) {
                        setPl(dmgval, dmgnum * wpnconfig.dmgmult);
                        setPl(critdmgmult, wpnconfig.critdmgmult);
                        setPl(critchnc, wpnconfig.critchance);
                        setPl(cooldown, wpnconfig.cooldown);
                        setPl(range, wpnconfig.range);
                        setPl(delay, wpnconfig.delay);
                        setPl(sound, wpnconfig.weaponsound);
                        setPl(hitsound, wpnconfig.weaponhitsound);
                        setPl(sndptch, wpnconfig.soundpitch);
                        hasWeapon = true;
                        break;
                    }
                }
                if (!hasWeapon) {
                    setPl(dmgval, dmgnum);
                    setPl(critdmgmult, critmultiplier);
                    setPl(critchnc, critchance);
                    setPl(range, attackrange);
                    setPl(cooldown, attackcooldown);
                    setPl(delay, attackdelay);
                    setPl(sound, attacksound);
                    setPl(hitsound, attackhitsound);
                    setPl(sndptch, attacksoundpitch);
                }
            } else {
                setPl(dmgval, dmgnum);
                setPl(critdmgmult, critmultiplier);
                setPl(critchnc, critchance);
                setPl(range, attackrange);
                setPl(cooldown, attackcooldown);
                setPl(delay, attackdelay);
                setPl(sound, attacksound);
                setPl(hitsound, attackhitsound);
                setPl(sndptch, attacksoundpitch);
            };
            world.playSound(getPl(sound),player.location,{pitch: getPl(sndptch)});
            
        let nearbyEntities = player.dimension.getEntities({
            maxDistance: getPl(range),
            closest: closestentitynumber,
            excludeTypes: excludedTypes,
            excludeFamilies: excludedFamilies,
            location: player.location
        });
        for (const entity of nearbyEntities) {
            let color = '§f'
            const randompitch = getRandomFloat(0.9,1.2);
            if (getRandomFloat(0,100) <= getPl(critchnc)) {
                dmg = Math.floor(getPl(dmgval) * (getRandomFloat(mindmgmult, maxdmgmult)*10)/10) * getPl(critdmgmult);
                console.warn(`crit! dealt ${dmg} damage`);
                color = '§l§e'
                
                system.runTimeout(() => {
                entity.dimension.spawnParticle('minecraft:critical_hit_emitter',{x: entity.location.x, y: entity.location.y+1.5, z:entity.location.z});
                player.runCommand('camerashake add @s 0.01 0.15 positional');
                world.playSound("random.break",player.location,{pitch:1.2});
                player.playSound("random.orb",{pitch:randompitch, volume:0.6});
            }, getPl(delay)); 
                }
                else {
                    dmg = Math.floor(getPl(dmgval) * getRandomFloat(mindmgmult, maxdmgmult)*10)/10;
                    console.warn(`dealt ${dmg} damage`);
            };
            system.runTimeout(() => {
            entity.applyDamage(dmg,{cause: EntityDamageCause.override, damagingEntity: player});
            entity.addEffect('slowness',15,{amplifier:9,showParticles:false});
            system.runTimeout(() => {
                entity.clearVelocity
            },1);

            // effect
            const health = entity.getComponent('minecraft:health');
            player.onScreenDisplay.setActionBar(`§c${Math.floor(health.currentValue*10)/10}§f/§c${health.effectiveMax}\n${color}-${dmg}`);
            entity.dimension.spawnParticle('minecraft:large_explosion',{x:entity.location.x,y:entity.location.y+1,z:entity.location.z});
            world.playSound(getPl(hitsound),player.location);
            player.runCommand('camerashake add @s 0.01 0.05 rotational');
            }, getPl(delay));
            
            // script
                };
                player['attackcooldown'] = time + getPl(cooldown);
            }, 0);
        }
    }
});