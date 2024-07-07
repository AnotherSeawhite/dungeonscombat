import { system, world, EntityDamageCause } from '@minecraft/server'

let dmgnum = 0;

// function getRandomFloat(min, max) {
//     return Math.random() * (max - min) + min;
// }
// for critical hit mechanics, gonna have to make proper combat mechanics first

// fun fact:
// this took days to make because of bugs


world.afterEvents.entityHurt.subscribe(({damage, damageSource, hurtEntity}) => {
    const player = damageSource.damagingEntity;
    const hitbox = hurtEntity;
    if (hitbox.typeId == "dungeonscombat:hitbox" && player.typeId == "minecraft:player" && damageSource.cause == EntityDamageCause.entityAttack ) {
        dmgnum = damage;
        let nearbyEntities = player.dimension.getEntities({
            maxDistance: 3,
            closest: 1,
            excludeTypes: ['player', 'item', 'xp_orb'],
            excludeFamilies: ['dchitbox', 'dchitboxride'],
            location: player.location
        });
        for (const entity of nearbyEntities) {
            entity.applyDamage(dmgnum,{cause: EntityDamageCause.entityAttack, damagingEntity: player});
        }
    console.warn(`${player} dealt ${dmgnum} damage`)
    }
});
