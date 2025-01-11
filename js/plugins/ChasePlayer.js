/*:
 * @plugindesc Autonomous NPC Chasing Player Plugin - Start Chase on 5-tile Range, Continue Chasing
 * @author 
 * 
 * @help
 * This plugin allows NPCs to start chasing the player when within a defined tile range
 * (e.g., 5 tiles). Once the chase starts, the NPC will continue chasing the player even
 * if the distance exceeds the range, with movement based on the RPG Maker settings.
 *
 * Plugin Commands:
 * - ActivateChase : Enables NPC chase behavior (resets chase if NPC is within range).
 * - DeactivateChase : Disables NPC chase behavior (resets chase if NPC was chasing).
 *
 * Usage:
 * Add the following script call to an event's "Autonomous Movement" route:
 *   this.startChase(5); // Replace 5 with your desired tile range
 *
 * Features:
 * - NPC starts chasing when within the tile range.
 * - NPC continues chasing the player regardless of the distance.
 * - Movement speed and frequency follow RPG Maker engine settings for natural movement.
 * - Can be used for any event.
 */

(function() {
    // Track if the chase has started and if it should be active
    Game_Event.prototype.hasStartedChase = false;
    Game_Event.prototype.isChaseActive = true; // Control chase activation

    // Start the chase behavior for an NPC
    Game_Event.prototype.startChase = function(maxRange) {
        if (!this.isChaseActive) return; // If chase is deactivated, do nothing

        const playerX = $gamePlayer.x;
        const playerY = $gamePlayer.y;
        const npcX = this.x;
        const npcY = this.y;

        const distance = Math.abs(playerX - npcX) + Math.abs(playerY - npcY);

        // Check if the player is within range, and if the chase has not started yet
        if (!this.hasStartedChase && distance <= maxRange) {
            this.hasStartedChase = true; // Mark that the chase has started
        }
	else
	{
	    this.hasStartedChase = false;
	}
	

        // If chase has started, continue chasing the player regardless of distance
        if (this.hasStartedChase) {
            this.moveTowardPlayer(playerX, playerY);
        }
    };

    // The NPC will move toward the player's position
    Game_Event.prototype.moveTowardPlayer = function(playerX, playerY) {
        const npcX = this.x;
        const npcY = this.y;

        let possibleDirections = [];

        // Check if NPC can move in the direction towards the player
        if (npcX < playerX && $gameMap.isPassable(npcX + 1, npcY, 6)) possibleDirections.push(6); // Right
        if (npcX > playerX && $gameMap.isPassable(npcX - 1, npcY, 4)) possibleDirections.push(4); // Left
        if (npcY < playerY && $gameMap.isPassable(npcX, npcY + 1, 2)) possibleDirections.push(2); // Down
        if (npcY > playerY && $gameMap.isPassable(npcX, npcY - 1, 8)) possibleDirections.push(8); // Up

        // If no direction found, try alternative directions
        if (possibleDirections.length === 0) {
            if ($gameMap.isPassable(npcX + 1, npcY, 6)) possibleDirections.push(6); // Right
            if ($gameMap.isPassable(npcX - 1, npcY, 4)) possibleDirections.push(4); // Left
            if ($gameMap.isPassable(npcX, npcY + 1, 2)) possibleDirections.push(2); // Down
            if ($gameMap.isPassable(npcX, npcY - 1, 8)) possibleDirections.push(8); // Up
        }

        // Move in one of the available directions
        if (possibleDirections.length > 0) {
            const direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
            this.moveStraight(direction); // Move in a random valid direction
        }
    };

    // Plugin command to activate or deactivate chase behavior
    PluginManager.registerCommand('ActivateChase', function() {
        $gameMap.events().forEach(function(event) {
            if (event instanceof Game_Event) {
                event.isChaseActive = true;  // Enable chase behavior
                event.hasStartedChase = false;  // Reset chase state (will start chasing if within range)
                event.startChase(5); // Ensure the NPC starts chasing if within range
            }
        });
    });

    PluginManager.registerCommand('DeactivateChase', function() {
        $gameMap.events().forEach(function(event) {
            if (event instanceof Game_Event) {
                event.isChaseActive = false;  // Disable chase behavior
                event.hasStartedChase = false;  // Reset chase state
            }
        });
    });

    // Hook into the Transfer Player and Set Event Location commands
    Game_Interpreter.prototype.command205 = function(params) {
        // Call the original Transfer Player command
        const result = Game_Interpreter.prototype.command205.call(this, params);
        
        // Ensure NPC's chase behavior is reset after transfer
        $gameMap.events().forEach(function(event) {
            if (event instanceof Game_Event) {
                event.hasStartedChase = false; // Reset chase state immediately
            }
        });

        return result;
    };

    Game_Interpreter.prototype.command205SetLocation = function(eventId, x, y) {
        $gameMap.events().forEach(function(event) {
            if (event.id === eventId) {
                event.setPosition(x, y); // Set the NPC's position
                event.hasStartedChase = false; // Reset chase state
            }
        });
    };

})();
