#scoreboard set
scoreboard objectives add dc_camerastate dummy dc_camerastate
scoreboard objectives add dc_incombat dummy dc_incombat
scoreboard objectives add dc_rot dummy dc_rotation
scoreboard objectives add dc_campos dummy camposition

#turn it on automatically
tag @a[tag=!dcspawn] add dcstate

#settings
gamerule pvp false
scoreboard players add @a[tag=!dcspawn] dc_incombat 0
scoreboard players set @a[tag=!dcspawn] dc_rot 1
scoreboard players set @a[tag=!dcspawn] dc_campos 1
scoreboard players set @a[tag=!dcspawn] dc_camerastate 1

#camera lock
execute as @a[tag=!dcspawn] at @s run tp @s ~~1~ -45 0
inputpermission set @a[tag=!dcspawn] camera disabled

tellraw @a[tag=!dcspawn] {"rawtext":[{"text":"Welcome to Dungeons Combat! Currently, combat mechanics are in development."}]}

tellraw @a[tag=!dcspawn] {"rawtext":[{"text":"It is recommened to play with 40.00° FOV, 10 render distance, and autojump disabled. You can also type '/function dc.off' to disable the addon, '/function dc.on' to enable it back, and '/function dc.rotatecam' to change the position of the camera."}]}

tellraw @a[tag=!dcspawn] {"rawtext":[{"text":"Ranged weapons are currently unusable, so beware!"}]}

tellraw @a[tag=!dcspawn] {"rawtext":[{"text":"If you're creating maps or stuffs with this addon, you can edit these messages in Behavior pack. More info in PlanetMinecraft update log."}]}

#spawn tag
tag @a add dcspawn