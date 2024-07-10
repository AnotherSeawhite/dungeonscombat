Welcome, and thanks for playing & using Dungeons Combat Addon!
This README entails (maybe) everything needed for the resource pack / client-side visual modification of the addon. For scripts and system, check the behavior pack!

0. Beginning

Dungeons Combat's first priority is compatibility with other mods and ease of modification. Though I can't guarantee that it's entirely compatible with everything, I my best to make it easy to modify the addon.

(not all but most of) Dungeons Combat assets has "dungeonscombat" identifier or files with "dc_" on it. This is to avoid slightest chance of confusion. 


1. Player Indicator Model

The white square, or player indicator on player is done by applying a custom model on top of the player's model. To use this for custom player animations or models, simply copy and paste the files that starts with "dc_playerindicator". Also refer to "player.entity.json".


2. Player Animations / Movement

Dungeons Combat uses top-down view camera with custom movement. Since changing the rotation of player's server-side head is not possible, you would have to do a workaround that changes the rotation of player's client-side(aka visual) 'root bone' based on player's movement. Thankfully, Dungeons Combat has that. Refer to "player.entity.json" and animation files for more info.
