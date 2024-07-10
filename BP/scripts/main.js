import { system, world, EntityComponentTypes } from "@minecraft/server"
import { Camera } from "./cameraclass.js"
import "./combat.js"

function getScore(target, objective, useZero = true) { // get scoreboard
    try {
        const obj = world.scoreboard.getObjective(objective);
        if (!obj) return "";
        if (typeof target == "string")
            return obj.getScore(
                obj.getParticipants().find((v) => v.displayName == target)
            );
        const isParticipant = obj.hasParticipant(target);
        if (!isParticipant) return 0;
        return obj.getScore(target.scoreboardIdentity);
    } catch {
        return useZero ? 0 : NaN;
    }
}

system.runInterval(() => {
    for (const players of world.getAllPlayers()) {
        const camerastate = getScore(players, "dc_camerastate");
        if (camerastate === 1) {
            const campos = getScore(players, "dc_campos");
            const camdist = getScore(players, "dc_camdist");
            let xOffset = 0; // not to be confused with XOffset
            let zOffset = 0; // this one too
            switch (campos) {
                case 1: // South West
                    xOffset = 5;
                    zOffset = 5;
                    break;
                case 2: // North West
                    xOffset = -5;
                    zOffset = 5;
                    break;
                case 3: // North East
                    xOffset = -5;
                    zOffset = -5;
                    break;
                case 4: // South East
                    xOffset = 5;
                    zOffset = -5;
                    break;
                default:
                    break;
            }

            const PlayerLocation = { 
                // note: in practice, negative value is positive and vice versa. ex) if Campos is 1, its actually (-5, 8.66, -5) and not (5, -8.66, 5)
                x: players.getHeadLocation().x + xOffset,
                y: players.getHeadLocation().y - 8.66,
                z: players.getHeadLocation().z + zOffset
            };
            const Camerafunction = new Camera(players).BehindPlayerFocusOnLocation(PlayerLocation, camdist, { CanBlockObstructView: false }); // the camera breaks if any Offset is used. use PlayerLocation instead
            Camerafunction;
                players.addEffect('blindness', 10, {amplifier:0,showParticles:false});
            // this disables sprinting and crits
        }
    }
});

// summon hitbox upon joining
world.afterEvents.playerSpawn.subscribe(({ player }) => {
  const hitboxspawn = player.dimension.spawnEntity("dungeonscombat:hitboxride", player.location);
  const rideableComp = player.getComponent("minecraft:rideable");
  rideableComp.addRider(hitboxspawn);
  player.runCommand('function dc.message')
});