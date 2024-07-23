#start
tag @a add dcstate
gamerule pvp false

#fix rotation
execute as @a[tag=dcstate] at @s run tp @s ~~~ -45 -45

#camera
scoreboard players set @a dc_camerastate 1