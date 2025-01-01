/*:
 * @plugindesc Autonomous NPC Chasing Player Plugin - Smooth Movement and Conditional Behavior
 * @author 
 * 
 * @help
 * This plugin allows NPCs to chase the player when within a defined tile range, 
 * stopping if the player is facing them.
 *
 * Usage:
 * Add the following script call to an event's "Autonomous Movement" route:
 *   this.startChase(25); // Replace 25 with your desired tile range
 *
 * Features:
 * - Smooth chasing behavior.
 * - Stops moving if the player faces the NPC.
 * - Can be used for any event.
 */

(function() {
    // Start the chase behavior for an NPC
    Game_Event.prototype.startChase = function(maxRange) {
        const playerX = $gamePlayer.x;
        const playerY = $gamePlayer.y;
        const npcX = this.x;
        const npcY = this.y;

        const distance = Math.abs(playerX - npcX) + Math.abs(playerY - npcY);

        // Check if player is within range and not facing the NPC
        if (distance <= maxRange && !this.isPlayerFacingNPC(playerX, playerY, npcX, npcY)) {
            this.moveTowardCharacter($gamePlayer);
        }
    };

    // Determine if the player is facing the NPC
    Game_Event.prototype.isPlayerFacingNPC = function(playerX, playerY, npcX, npcY) {
        const playerDirection = $gamePlayer.direction();
        if (playerDirection === 2 && npcY > playerY) return true; // Down
        if (playerDirection === 4 && npcX < playerX) return true; // Left
        if (playerDirection === 6 && npcX > playerX) return true; // Right
        if (playerDirection === 8 && npcY < playerY) return true; // Up
        return false;
    };

    // Override moveTowardCharacter for smoother movement
    const _Game_Character_moveTowardCharacter = Game_Character.prototype.moveTowardCharacter;
    Game_Character.prototype.moveTowardCharacter = function(character) {
        const sx = this.deltaXFrom(character.x);
        const sy = this.deltaYFrom(character.y);

        if (Math.abs(sx) > Math.abs(sy)) {
            this.moveStraight(sx > 0 ? 4 : 6);
            if (!this.isMovementSucceeded()) this.moveStraight(sy > 0 ? 8 : 2);
        } else {
            this.moveStraight(sy > 0 ? 8 : 2);
            if (!this.isMovementSucceeded()) this.moveStraight(sx > 0 ? 4 : 6);
        }
    };
})();
