#turn off
scoreboard players set @a dc_camerastate 0
inputpermission set @a[tag=dcstate] camera enabled

#tag
tag @a remove dcstate
gamerule pvp true

#go back
camera @a clear