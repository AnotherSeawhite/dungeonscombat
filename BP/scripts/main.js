import { system, world } from "@minecraft/server"
import { Camera } from "./cameraclass.js"

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
        const Camerastate = getScore(players, "camerastate");
        if (Camerastate === 1) {
            const Campos = getScore(players, "campos"); // calculated in rot.mcfunction
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
                // note: in practice, negative value is positive and vice versa. ex) if Rot is 1, its actually (-5, 10, -5) and not (5, -10, 5)
                x: players.getHeadLocation().x + xOffset,
                y: players.getHeadLocation().y - 10,
                z: players.getHeadLocation().z + zOffset
            };
            const Camerafunction = new Camera(players).BehindPlayerFocusOnLocation(PlayerLocation, 10, { CanBlockObstructView: false }); // the camera breaks if any Offset is used. use PlayerLocation instead
            Camerafunction;
        }
    }
});