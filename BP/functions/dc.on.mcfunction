tag @a add dcstate
execute as @a[tag=dcstate] at @s run tp @s ~~1~ -45 0
inputpermission set @a[tag=dcstate] camera disabled
scoreboard players set @a dc_camerastate 1