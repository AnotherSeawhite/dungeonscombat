import { system, world, EntityComponentTypes, ItemStack } from "@minecraft/server"
import { ModalFormData } from "@minecraft/server-ui"
import "./combat.js"

const dimensions = [
    "overworld",
    "nether",
    "the_end"
    ]

for (const dimension of dimensions) {
    for (const dummies of world.getDimension(dimension).getEntities({type: "dungeonscombat:healthbar"})) {
    dummies.remove(); // remove health bars and damage indicators on world load
}
}

function clearcamera(player) {
    player.camera.clear()
    player.runCommand("inputpermission set @s camera enabled")
}

function setcamera(player) {
	const campos = player.getDynamicProperty("dc_campos");
	let dir = -45;
        switch (campos) {
            case 1:
                dir = -45;
                break;
            case 2:
                dir = -135;
                break;
            case 3:
                dir = 135;
                break;
            case 4:
                dir = 45;
                break;
            default:
                break;
            }
    player.teleport(player.location,{rotation:{x: -45, y: dir}})
    player.runCommand("inputpermission set @s camera disabled")
}
   
function dcConfig(player) {
    let form = new ModalFormData()
    .title("Dungeons Combat Settings")
    .toggle("Toggle Mod\n(You can use compass to open this menu.)", player.getDynamicProperty("dc_state"))
    .slider("Camera Distance", 15, 30, 1, player.getDynamicProperty("dc_camdist"))
    .slider("Camera Position", 1, 4, 1, player.getDynamicProperty("dc_campos"))
    .slider("Camera Lerp", 10, 50, 5, player.getDynamicProperty("dc_camlerp"));  
    form.show(player).then((response) => {
        const { canceled, formValues, cancelationReason } = response;
        if (response && canceled && cancelationReason === "UserBusy") {
            dcConfig(player);
            return;
        }
        if (canceled) return;
        player.setDynamicProperty("dc_state",formValues[0])
        player.setDynamicProperty("dc_camdist",formValues[1])
        player.setDynamicProperty("dc_campos",formValues[2])
        player.setDynamicProperty("dc_camlerp",formValues[3])
        if (player.getDynamicProperty("dc_state") == true) {
        	setcamera(player)
        } else {
        	clearcamera(player)
        }
    })
    }
    //
//})

// summon hitbox upon joining
world.afterEvents.playerSpawn.subscribe((spawn) => {
    const player = spawn.player;
    const initialSpawn = spawn.initialSpawn;
    const hitboxridespawn = player.dimension.spawnEntity("dungeonscombat:hitboxride", player.location);
    const rideableComp = player.getComponent("minecraft:rideable");
  player.runCommand('function dc.message');
    rideableComp.addRider(hitboxridespawn);
    function repeat(times) {
    for (let i = 0; i < times; i++) {
    	hitboxridespawn.runCommand("ride @s summon_rider dungeonscombat:hitbox");
    }} repeat(3);
    if (initialSpawn && !(player.hasTag("dc_initial"))) {
    	setcamera(player)
    	player.setDynamicProperty("dc_state", true)
        player.setDynamicProperty("dc_camdist", 18)
        player.setDynamicProperty("dc_campos",1)
        player.setDynamicProperty("dc_camlerp", 15)
        player.runCommand(`give @s compass 1 0 {"minecraft:keep_on_death": {},"minecraft:item_lock":{"mode":"lock_in_inventory"}}`)
        player.addTag("dc_initial")
    	dcConfig(player);
    } else if (!initialSpawn) {
    	if (player.getDynamicProperty("dc_state") == true) {
    	    	setcamera(player)
    } else {
    	clearcamera(player)
    }}
});

system.runInterval(() => {
    world.getPlayers().forEach(player => {
    	if (player.getDynamicProperty("dc_state") == true) {
        const angle = 54.7356*(Math.PI/180)
            const range = player.getDynamicProperty("dc_camdist")
            const campos = player.getDynamicProperty("dc_campos")
            let xOffset= -1;
            let zOffset = -1;
        switch (campos) {
            case 1:
                xOffset = -1;
                zOffset = -1;
                break;
            case 2:
                xOffset = -1;
                zOffset = 1;
                break;
            case 3:
                xOffset = 1;
                zOffset = 1;
                break;
            case 4:
                xOffset = 1;
                zOffset = -1;
                break;
            default:
                break;
            }
            const camlocation = { 
                x: player.location.x + (range * xOffset),
                y: player.location.y + (range*Math.tan(angle)),
                z: player.location.z + (range * zOffset),
            }
            player.camera.setCamera("dungeonscombat:free",{
            	easeOptions: {easeTime: player.getDynamicProperty("dc_camlerp")/100, easeType: "Linear"}, 
                location:camlocation, 
                facingLocation: {x: player.location.x, y: (player.location.y+player.getHeadLocation().y)/2, z: player.location.z }
                })
            player.addEffect('blindness', 10, {amplifier:0,showParticles:false});
            // this disables sprinting and crits
        } else {
clearcamera(player)
};
        
        })
});

world.beforeEvents.itemUse.subscribe((data) => {
    const player = data.source;
    const item = data.itemStack;
    if (item.typeId == "minecraft:compass" && player.typeId == "minecraft:player") {
        system.run(() => {
        dcConfig(player)
        })
    }
})