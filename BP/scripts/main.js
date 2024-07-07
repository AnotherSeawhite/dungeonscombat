import { system, world } from "@minecraft/server"
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
        const Camerastate = getScore(players, "dc_camerastate");
        if (Camerastate === 1) {
            const Campos = getScore(players, "dc_campos"); // calculated in dc_rot.mcfunction
            let xOffset = 0; // not to be confused with XOffset
            let zOffset = 0; // this one too
            switch (Campos) {
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
            const Camerafunction = new Camera(players).BehindPlayerFocusOnLocation(PlayerLocation, 30, { CanBlockObstructView: false }); // the camera breaks if any Offset is used. use PlayerLocation instead
            Camerafunction;
            // this disables sprinting and crits
                players.addEffect('blindness', 10, {amplifier:0,showParticles:false});
        }
    }
});

// summon hitbox upon joining
//
// behind story of this code: i am still inexperienced in scripting and
// i wasted 2 hours making this to work. it ended up not working so i
// had to get others help
world.afterEvents.playerSpawn.subscribe(({ player }) => {
  const hitboxspawn = player.dimension.spawnEntity("dungeonscombat:hitboxride", player.location);
  const rideableComp = player.getComponent("minecraft:rideable");
  rideableComp.addRider(hitboxspawn);
  if (!rideableComp.getComponent("minecraft:riding") || rideableComp.getComponent("minecraft:riding").entityRidingOn.typeId !== "minecraft:player") { 
    hitboxspawn.remove(); 
  };
});