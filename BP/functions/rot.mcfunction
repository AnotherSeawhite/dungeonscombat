execute as @a[tag=dcstate] at @s if entity @s[rym=-90,ry=0] run scoreboard players set @s rot 1
execute as @a[tag=dcstate] at @s if entity @s[rym=0,ry=-90] run scoreboard players set @s rot 2
execute as @a[tag=dcstate] at @s if entity @s[rym=90,ry=180] run scoreboard players set @s rot 3
execute as @a[tag=dcstate] at @s if entity @s[rym=-180,ry=-90] run scoreboard players set @s rot 4