import { system, world, EntityDamageCause } from '@minecraft/server'
import { weaponConfig, attackSettings, advancedSettings } from './combatconfig';

// fun fact:
// this took days to make because of bugs

// ################### DON'T TOUCH ANYTHING BELOW! ###################
// ################ UNLESS YOU KNOW WHAT YOU'RE DOING ################
let { attackcooldown, attackrange, attackradius, mindmgmult, maxdmgmult, critchance, attacksound, attackhitsound, attacksoundpitch } = attackSettings;
let { healthVisualmultiplier, types, families, excludedTypes, excludedFamilies } = advancedSettings;

function dotProduct(v1, v2) {
    return v1.x * v2.x + v1.z * v2.z;
}

function magnitude(v) {
    return Math.sqrt(v.x * v.x + v.z * v.z);
}

function calculateAngle(v1, v2) {
    const dot = dotProduct(v1, v2);
    const mag1 = magnitude(v1);
    const mag2 = magnitude(v2);
    return Math.acos(dot / (mag1 * mag2)) * (180 / Math.PI);
}

function getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
};

function getWeaponStats(player, item) {
    function setPl(id, val) {
        player.setDynamicProperty(id,val);
    }
    function getPl(id) {
        return player.getDynamicProperty(id);
    }
    if (item && item.typeId) {
        let hasWeapon = false;
        for (const weapon in weaponConfig) {
            const wpnconfig = weaponConfig[weapon]
            const itemIdentifier = item.typeId.split(":")[0];
            const itemTypeId = item.typeId.split(":")[1];
            if (itemIdentifier === wpnconfig.identifier && wpnconfig.ids.some(id => itemTypeId.includes(id))) {
                setPl('dc_dmgval', getPl('dc_dmgnum') * wpnconfig.dmgmult);
                setPl('dc_critchnc', wpnconfig.critchance);
                setPl('dc_cooldown', wpnconfig.cooldown);
                setPl('dc_range', wpnconfig.range);
                setPl('dc_radius', wpnconfig.radius);
                setPl('dc_delay', wpnconfig.delay);
                setPl('dc_hitstun', wpnconfig.hitstun);
                setPl('dc_knockback', wpnconfig.knockback);
                setPl('dc_sound', wpnconfig.weaponsound);
                setPl('dc_hitsound', wpnconfig.weaponhitsound);
                setPl('dc_sndptch', wpnconfig.soundpitch);
                if (wpnconfig.swingScript) {
                    wpnconfig.swingScript(world,player);
                }

                hasWeapon = true;
                break;
            }
        }
        if (!hasWeapon) {
            setPl('dc_dmgval', getPl('dc_dmgnum'));
            setPl('dc_critchnc', critchance);
            setPl('dc_cooldown', attackcooldown);
            setPl('dc_range', attackrange);
            setPl('dc_radius', attackradius);
            setPl('dc_delay', 1);
            setPl('dc_hitstun', 0.3);
            setPl('dc_sound', attacksound);
            setPl('dc_hitsound', attackhitsound);
            setPl('dc_sndptch', attacksoundpitch);
        }
    } else {
        setPl('dc_dmgval', getPl('dc_dmgnum'));
        setPl('dc_critchnc', critchance);
        setPl('dc_cooldown', attackcooldown);
        setPl('dc_range', attackrange);
        setPl('dc_radius', attackradius);
        setPl('dc_delay', 1);
        setPl('dc_hitstun', 0.3);
        setPl('dc_sound', attacksound);
        setPl('dc_hitsound', attackhitsound);
        setPl('dc_sndptch', attacksoundpitch);
    };
}

world.afterEvents.entityHitEntity.subscribe((hit) => {
    const player = hit.damagingEntity;
    const hitbox = hit.hitEntity;
    const equipment = player.getComponent('equippable'); 
    const item = equipment ? equipment.getEquipment('Mainhand') : undefined;
    const time = Date.now();
    function setPl(id, val) {
        player.setDynamicProperty(id,val);
}
    function getPl(id) {
        return player.getDynamicProperty(id);
}
    if (hitbox.typeId == "dungeonscombat:hitbox" && player.typeId == "minecraft:player") {
        if (!(player['attackcooldown'] > time)) {
            system.runTimeout(() => {
            getWeaponStats(player, item);
            world.playSound(getPl('dc_sound'),player.location,{pitch: getRandomFloat(0.9,1.1)*getPl('dc_sndptch')});
        // TODO: replace with getComponent 'minecraft:movement' in future
        player.addEffect('slowness',Math.round(getPl('dc_cooldown')/50)+1,{amplifier:9,showParticles:false});
        ////////////////
            
        let nearbyEntities = player.dimension.getEntities({
            maxDistance: getPl('dc_range'),
            minDistance: getPl('dc_range')/2,
            families: families,
            excludeTypes: excludedTypes,
            excludeFamilies: excludedFamilies,
            location: player.location
        });
         const closeEntities = player.dimension.getEntities({
            maxDistance: getPl('dc_range')/2,
            families: families,
            excludeTypes: excludedTypes,
            excludeFamilies: excludedFamilies,
            location: player.location
        })
        const pLoc = player.location;

        function attack(player, entity) {
            const randompitch = getRandomFloat(0.9,1.2);
            if (getRandomFloat(0,100) <= getPl('dc_critchnc')) {
                setPl('dc_dmg', (getPl('dc_dmgval') * 2));
                entity.setDynamicProperty('dc_crit','§c')
                } else {
                    entity.setDynamicProperty('dc_crit','§f')
                    setPl('dc_dmg',getPl('dc_dmgval'));
            };

            //const knockbackRes = entity.getComponent('minecraft:knockback_resistance');
            //const stunTick = Math.max(0,(getPl('dc_hitstun')*10) * (1-knockbackRes));
            const stunTick = getPl('dc_hitstun') * 5
            const dmgcalc = getPl('dc_dmg') * getRandomFloat(mindmgmult, maxdmgmult);
            entity.setDynamicProperty('dc_fakedmg',dmgcalc);
            system.runTimeout(() => {
            entity.applyDamage(dmgcalc,{cause: EntityDamageCause.override, damagingEntity: player});
            entity.clearVelocity();
            if (entity.getDynamicProperty('dc_crit') == '§c') {
            	entity.dimension.spawnParticle('minecraft:critical_hit_emitter',{x: entity.location.x, y: (entity.location.y+entity.getHeadLocation().y)/2, z:entity.location.z});
                player.runCommand('camerashake add @s 0.01 0.15 positional');
                world.playSound("random.break",player.location,{pitch:1.2});
                player.playSound("random.orb",{pitch:randompitch, volume:0.6});
            };
            entity.addEffect('slowness',stunTick,{amplifier:255,showParticles:false});
            entity.addTag('dc_stunned')
            system.runTimeout(() => {
            	entity.removeTag('dc_stunned')
            }, stunTick)
            entity.applyKnockback(getPl('dc_velocity').x,getPl('dc_velocity').z,0.5*getPl('dc_knockback'),0.2*getPl('dc_knockback'))
            if (entity.getComponent('minecraft:health').currentValue <= 0) {
                entity.applyKnockback(getPl('dc_velocity').x,getPl('dc_velocity').z,1.2*getPl('dc_knockback'),0.3)
            }
            entity.dimension.spawnParticle('minecraft:large_explosion',{x:entity.location.x,y:(entity.location.y+entity.getHeadLocation().y)/2,z:entity.location.z});
            world.playSound(getPl('dc_hitsound'),player.location,{volume: 3,pitch: getRandomFloat(0.9,1.1)*getPl('dc_sndptch')});
            player.runCommand('camerashake add @s 0.01 0.01 rotational');
            }, getPl('dc_delay'));
            };
        nearbyEntities.forEach(entity => {
            const eLoc = entity.location;
            const toEntityVec = {
                x: eLoc.x - pLoc.x,
                z: eLoc.z - pLoc.z
            };
            const angle = calculateAngle(getPl('dc_velocity'), toEntityVec);
            if ((angle >= -getPl('dc_radius') && angle <= getPl('dc_radius'))) attack(player, entity)
        })
        closeEntities.forEach(entity => {
            const closeELoc = entity.location;
            const tocloseEntityVec = {
                x: closeELoc.x - pLoc.x,
                z: closeELoc.z - pLoc.z
            };
            const closeangle = calculateAngle(getPl('dc_velocity'), tocloseEntityVec);
            if (closeangle >= -getPl('dc_radius')*1.5 && closeangle <= getPl('dc_radius')*1.5) attack(player, entity)
        })
            player['attackcooldown'] = time + getPl('dc_cooldown');
    }, 0)}
}});

world.afterEvents.entityHurt.subscribe(({ damage, damageSource, hurtEntity }) => {
    const target = hurtEntity;
    const player = damageSource.damagingEntity;
    if (target.typeId.includes("dungeonscombat:") || target.typeId == "minecraft:player") return;
    const equipment = player ? player.getComponent('equippable') : undefined; 
    const item = equipment ? equipment.getEquipment('Mainhand') : undefined;
        for (const weapon in weaponConfig) {
            const wpnconfig = weaponConfig[weapon];
            const itemIdentifier = item ? item.typeId.split(":")[0] : undefined;
            const itemTypeId = item ? item.typeId.split(":")[1] : undefined;
            if (itemIdentifier === wpnconfig.identifier && wpnconfig.ids.some(id => itemTypeId.includes(id))) { 
                if (wpnconfig.hitScript) {
                    wpnconfig.hitScript(world,player,target,damage);
                } else return;
            }
        }
    }
)

const activeHealthBars = new Map();

function updateHealthBar(entity, healthbar) {
    const health = entity.getComponent('minecraft:health');
    if (entity.typeId.includes("dungeonscombat:")) return;
    function entityHealthBar(symbol) {
    	const barwidth = 40;
    	const length = Math.max(barwidth,Math.min(health.defaultValue,barwidth+(health.effectiveMax/(health.defaultValue*0.01))))
        const dmgcolor = entity.getDynamicProperty('dc_dmgcolor');
        let hp = Math.round((entity.getDynamicProperty('dc_curhp') / health.effectiveMax) * length);
        let hpdiff = Math.round((entity.getDynamicProperty('dc_hpdiff') / health.effectiveMax) * length);
        let empty = length - hp;
        hp = hp - Math.abs(Math.min(hpdiff,0))
        empty = empty - Math.abs(Math.max(hpdiff,0))
        let entityhealth = '§c' + symbol.repeat(hp);
        entityhealth += dmgcolor + symbol.repeat(Math.abs(hpdiff));
        entityhealth += '§4' + symbol.repeat(empty);
        return entityhealth;
    }
       function clearrun() {
            system.clearRun(healthbarteleport);
            healthbar.remove();
            activeHealthBars.delete(entity.id);
            }
    const healthbarteleport = system.runInterval(() => {
        if (!healthbar) return;
        try {
        if ((health.currentValue >= 0) && entity) {
        	const hpdiff = entity.getDynamicProperty('dc_hpdiff');
            system.runTimeout(() => {
            entity.setDynamicProperty('dc_hpdiff',hpdiff-(hpdiff/2.5))
            })
            healthbar.teleport({ x: entity.location.x, y: entity.getHeadLocation().y + 0.5, z: entity.location.z });
            healthbar.nameTag = `▮${entityHealthBar('∣')}§r▮\n ${Math.floor(health.currentValue*10)/10} / ${health.effectiveMax}`;
        } else clearrun();
        } catch (error) {
           console.warn(error)
           clearrun();
        }
    });
}

world.afterEvents.entityHealthChanged.subscribe((ouch) => {
    const ouchentity = ouch.entity;
    if (ouchentity.typeId.includes("dungeonscombat:") || ouchentity.typeId == "minecraft:player") return;
    const eLoc = ouchentity.location;    
    const health = ouchentity.getComponent('minecraft:health')
    const hpchange = ouch.oldValue - ouch.newValue
    ouchentity.setDynamicProperty('dc_curhp',health.currentValue);
    ouchentity.setDynamicProperty('dc_hpdiff',ouch.oldValue-health.currentValue);
    if (ouchentity.getDynamicProperty('dc_crit') == undefined) ouchentity.setDynamicProperty('dc_crit','§f')
    if (ouchentity.getDynamicProperty('dc_dmgcolor') == undefined) ouchentity.setDynamicProperty('dc_dmgcolor','§f')
    const damageindicator = world.getDimension(ouchentity.dimension.id).spawnEntity('dungeonscombat:healthbar',{x:eLoc.x,y:ouchentity.getHeadLocation().y+1.5,z:eLoc.z});
    if ((ouch.newValue < ouch.oldValue) && (ouchentity.typeId != "minecraft:player")) {
        damageindicator.applyImpulse({x:getRandomFloat(-0.3,0.3),y:0.3,z:getRandomFloat(-0.3,0.3)});
        damageindicator.addEffect('slow_falling',20,{amplifier:0,showParticles:false});
        damageindicator.nameTag = `§l${ouchentity.getDynamicProperty('dc_crit')}${Math.abs((Math.round(hpchange*healthVisualmultiplier)))}`
        ouchentity.setDynamicProperty('dc_dmgcolor','§f')
    } else if (health.currentValue > ouch.oldValue) {
    	damageindicator.applyImpulse({x:0,y:0.4,z:0});
    	damageindicator.addEffect('slow_falling',20,{amplifier:0,showParticles:false});
        ouchentity.setDynamicProperty('dc_dmgcolor','§a')
        //damageindicator.applyImpulse({x:0,y:0.1,z:0});
        damageindicator.nameTag = `§a§l+§r§a${Math.abs(Math.round(hpchange*healthVisualmultiplier))}`
    } else if ((ouch.newValue == ouch.oldValue) && (ouchentity.typeId != "minecraft:player")) {
    	damageindicator.addEffect('levitation',20,{amplifier:0,showParticles:false});
    damageindicator.applyImpulse({x:0,y:0.01,z:0});
        //damageindicator.applyImpulse({x:0,y:0.1,z:0});
        damageindicator.nameTag = `§70`
        } 
        system.runTimeout(() => {
            damageindicator.remove()
        }, 15);

    if (!activeHealthBars.has(ouchentity.id)) {
    	const healthbarspawn = world.getDimension(ouchentity.dimension.id).spawnEntity('dungeonscombat:healthbar', ouchentity.location);
        activeHealthBars.set(ouchentity.id, healthbarspawn);
        updateHealthBar(ouchentity, healthbarspawn);
    }
});

world.afterEvents.entityHurt.subscribe(({damage, damageSource, hurtEntity}) => {
    const player = damageSource.damagingEntity;
    function setPl(id, val) {
        player.setDynamicProperty(id,val);
}
    try {
    if (hurtEntity.typeId == "dungeonscombat:hitbox" && player.typeId == "minecraft:player" ) {
        hurtEntity.addEffect('fire_resistance',10,{amplifier:0,showParticles:false});
        hurtEntity.addEffect('regeneration',100,{amplifier:255,showParticles:false});
        setPl('dc_dmgnum',damage);
    }} catch {
    	return;
    }
});

system.runInterval(() => {
    world.getPlayers().forEach(player => {
        const viewDir = player.getVelocity();
        const pLoc = player.location;
        function setPl(id, val) {
        player.setDynamicProperty(id,val);
        }
        function getPl(id) {
            return player.getDynamicProperty(id);
        }
        
        // if (player.isJumping && !(player.hasTag("dc_rolling"))) {
        // 	player.addTag("dc_rolling");
        // 	player.applyKnockback(getPl('dc_velocity').x, getPl('dc_velocity').z, 40, 1)
        //     system.runTimeout(() => {
        //         player.removeTag("dc_rolling");
        //     }, 40)
        // }
        // work in progress!
        
        try {
        const entities = player.dimension.getEntities({
            maxDistance: getPl('dc_range'),
            minDistance: getPl('dc_range')/2,
            families: families,
            excludeTypes: excludedTypes,
            excludeFamilies: excludedFamilies,
            location: player.location
        })
         const closeEntities = player.dimension.getEntities({
            maxDistance: getPl('dc_range')/2,
            families: families,
            excludeTypes: excludedTypes,
            excludeFamilies: excludedFamilies,
            location: player.location
        })
        if (Math.abs(viewDir.x) >= 0.04 && Math.abs(viewDir.z) >= 0.04) {
        	setPl('dc_velocity',viewDir);
        };
            const toVec = {
                x: pLoc.x + (viewDir.x*5),
                z: pLoc.z + (viewDir.z*5)
            };
        player.dimension.spawnParticle(`dungeonscombat:aimray`,{x: toVec.x, y: player.getHeadLocation().y-1, z: toVec.z})
        entities.forEach(entity => {
            const eLoc = entity.location;
            const toEntityVec = {
                x: eLoc.x - pLoc.x - (viewDir.x),
                z: eLoc.z - pLoc.z - (viewDir.z)
            };
            const angle = calculateAngle(getPl('dc_velocity'), toEntityVec);
            if (angle >= -getPl('dc_radius') && angle <= getPl('dc_radius')) {
                player.dimension.spawnParticle(`dungeonscombat:crosshair`,{x: eLoc.x, y: entity.getHeadLocation().y+0.5, z: eLoc.z})
            }
        });
        closeEntities.forEach(entity => {
            const eLoc = entity.location;
            const toEntityVec = {
                x: eLoc.x - pLoc.x - (viewDir.x),
                z: eLoc.z - pLoc.z - (viewDir.z)
            };
            const angle = calculateAngle(getPl('dc_velocity'), toEntityVec);
            if (angle >= -getPl('dc_radius')*1.5 && angle <= getPl('dc_radius')*1.5) {
                player.dimension.spawnParticle(`dungeonscombat:crosshair`,{x: eLoc.x, y: entity.getHeadLocation().y+0.5, z: eLoc.z})
            }
        });
    } catch (error) {}});
});