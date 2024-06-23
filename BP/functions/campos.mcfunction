execute as @a[tag=dcstate] at @s if entity @s[scores={campos=1}] run camera @s set dungeonscombat:free ease 0.2 linear pos ~-5 ~10 ~-5 facing @s
execute as @a[tag=dcstate] at @s if entity @s[scores={campos=2}] run camera @s set dungeonscombat:free ease 0.2 linear pos ~5 ~10 ~-5 facing @s
execute as @a[tag=dcstate] at @s if entity @s[scores={campos=3}] run camera @s set dungeonscombat:free ease 0.2 linear pos ~5 ~10 ~5 facing @s
execute as @a[tag=dcstate] at @s if entity @s[scores={campos=4}] run camera @s set dungeonscombat:free ease 0.2 linear pos ~-5 ~10 ~5 facing @s