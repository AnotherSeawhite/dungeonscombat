#scoreboard set
scoreboard objectives add dc_camerastate dummy dc_camerastate
scoreboard objectives add dc_incombat dummy dc_incombat
scoreboard objectives add dc_rot dummy dc_rotation
scoreboard objectives add dc_campos dummy dc_camposition
scoreboard objectives add dc_camdist dummy dc_camdistance

#turn it on automatically
tag @a[tag=!dcspawn] add dcstate

#settings
gamerule pvp false
scoreboard players add @a[tag=!dcspawn] dc_incombat 0
scoreboard players set @a[tag=!dcspawn] dc_rot 1
scoreboard players set @a[tag=!dcspawn] dc_campos 1
scoreboard players set @a[tag=!dcspawn] dc_camerastate 1
scoreboard players set @a[tag=!dcspawn] dc_camdist 30

#camera lock
inputpermission set @a[tag=!dcspawn] camera disabled

#spawn tag
tag @a add dcspawn