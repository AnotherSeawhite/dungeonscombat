Welcome, and thanks for playing & using Dungeons Combat Addon!
This README entails the stuff for the behavior pack / server-side modification of the addon. For visual effects and graphics, check the resoruce pack!

0. Beginning

Minecraft Dungeons have top-down isometric-like camera view. Recommeneded FOV is 40.00'.
When you start the game, the player will be given with blindness effect. This is to prevent sprinting and critical hits. The player's movement speed was 
slightly increased in exchange.


1. Functions

Functions are very crucial for the addon to run properly. It mainly uses scoreboard. It will be moved to scripts soon, but for now, it's on scoreboard.


2. Entities

Most of the entities in the addon are dummy entities, which are required for the scripts to function. (ex. Hitboxes and health bars)

3. Scripts

Scripts are also crucial for the camera and combat to function correctly.
'dc_campos' scoreboard value sets the camera position. It accepts 1 to 4, but you can add more angles in cameraclass.js script.
All the combats happen in combat.js. You can modify them if you want, but be careful, it's very prone to break! 


3.1. Combat

The player's attack direction is same as the direction the player is moving towards at. The radius, damage, cooldown/delay, etc, is all defined in combatcofig.json. You can also add more custom weapon configs!