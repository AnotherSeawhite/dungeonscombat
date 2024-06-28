scoreboard objectives add dc_camerastate dummy dc_camerastate
scoreboard objectives add dc_incombat dummy dc_incombat
scoreboard objectives add dc_rot dummy dc_rotation
scoreboard objectives add dc_campos dummy camposition
tag @a[tag=!dcspawn] add dcstate
scoreboard players add @a[tag=!dcspawn] dc_incombat 0
scoreboard players set @a[tag=!dcspawn] dc_rot 1
scoreboard players set @a[tag=!dcspawn] dc_campos 1
scoreboard players set @a[tag=!dcspawn] dc_camerastate 1
execute as @a[tag=!dcspawn] at @s run tp @s ~~1~ -45 0
inputpermission set @a[tag=!dcspawn] camera disabled
tellraw @a[tag=!dcspawn] {"rawtext":[{"text":"Welcome to Dungeons Combat! Currently, only Isometric movement has beem implemented, and combat is in development."}]}
tellraw @a[tag=!dcspawn] {"rawtext":[{"text":"It is recommened to play with 38.00° FOV, and with autojump disabled. You can also type '/function dc.off' to disable the addon, and '/function dc.on' to enable it back."}]}
tellraw @a[tag=!dcspawn] {"rawtext":[{"text":"If you're creating maps or stuffs with this addon, you can edit these messages in Behavior pack."}]}
tag @a add dcspawn