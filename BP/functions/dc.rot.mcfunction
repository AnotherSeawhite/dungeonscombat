execute as @a[tag=dcstate,hasitem={item=compass,location=slot.weapon.mainhand}] at @s if entity @s[y=~1.1,dy=0] unless entity @s[y=~1.51,dy=0] run scoreboard players operation @s dc_campos = @s dc_rot
execute as @a[tag=dcstate] at @s if entity @s[rym=-90,ry=0] run scoreboard players set @s dc_rot 1
execute as @a[tag=dcstate] at @s if entity @s[rym=0,ry=-90] run scoreboard players set @s dc_rot 2
execute as @a[tag=dcstate] at @s if entity @s[rym=90,ry=180] run scoreboard players set @s dc_rot 3
execute as @a[tag=dcstate] at @s if entity @s[rym=-180,ry=-90] run scoreboard players set @s dc_rot 4