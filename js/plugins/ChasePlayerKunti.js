/*:
 * @plugindesc Autonomous NPC Chasing Player Plugin - Start Chase on Tile Range, Stop on Contact
 * @author 
 * 
 * @help
 * This plugin allows NPCs to start chasing the player when within a defined tile range
 * (e.g., 5 tiles). Once the chase starts, the NPC will continue chasing the player until
 * it touches the player, after which the chase will stop.
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
 * - NPC continues chasing the player until contact is made.
 * - Movement speed and frequency follow RPG Maker engine settings for natural movement.
 * - Can be used for any event.
 */

(function() {
    // Track if the chase has started and if it should be active
    Game_Event.prototype.hasStartedChase = false;
    Game_Event.prototype.isChaseActive = true; // Control chase activation

    // Start the chase behavior for an NPC
    Game_Event.prototype.startChases = function() {
	this.isChaseActive = true;
  

        const playerX = $gamePlayer.x;
        const playerY = $gamePlayer.y;
        const npcX = this.x;
        const npcY = this.y;

        const distance = Math.abs(playerX - npcX) + Math.abs(playerY - npcY);

        // Check if the player is within range, and if the chase has not started yet
	this.hasStartedChase = true; // Mark that the chase has started
        if (!this.hasStartedChase && distance <= range) {
            
        }

        // If chase has started, continue chasing the player
        if (this.hasStartedChase) {
            this.moveTowardPlayer();

            // Check if the NPC has reached the player
            if (playerX === npcX && playerY === npcY) {
                this.stopChase(); // Stop chasing when NPC reaches player
            }
        }
    };

    // Stop the chase behavior for an NPC
    Game_Event.prototype.stopChase = function() {
        this.hasStartedChase = false;
        this.isChaseActive = false; // Deactivate chase
       
    };

    // The NPC will move toward the player's position
    Game_Event.prototype.moveTowardPlayer = function() {
        this.moveTowardCharacter($gamePlayer); // Built-in function to move toward player
    };

    // Plugin command to activate chase behavior
    PluginManager.registerCommand('ActivateChase', function() {
        $gameMap.events().forEach(function(event) {
            if (event instanceof Game_Event) {
                event.isChaseActive = true;  // Enable chase behavior
                event.hasStartedChase = false;  // Reset chase state
            }
        });
    });

    // Plugin command to deactivate chase behavior
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

    // Set NPC event location and reset chase behavior
    Game_Interpreter.prototype.command205SetLocation = function(eventId, x, y) {
        $gameMap.events().forEach(function(event) {
            if (event.id === eventId) {
                event.setPosition(x, y); // Set the NPC's position
                event.hasStartedChase = false; // Reset chase state
            }
        });
    };

})();/*:
 * @plugindesc Autonomous NPC Chasing Player Plugin - Start Chase on Tile Range, Stop on Contact
 * @author 
 * 
 * @help
 * This plugin allows NPCs to start chasing the player when within a defined tile range
 * (e.g., 5 tiles). Once the chase starts, the NPC will continue chasing the player until
 * it touches the player, after which the chase will stop.
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
 * - NPC continues chasing the player until contact is made.
 * - Movement speed and frequency follow RPG Maker engine settings for natural movement.
 * - Can be used for any event.
 */

(function() {
    // Track if the chase has started and if it should be active
    Game_Event.prototype.hasStartedChase = false;
    Game_Event.prototype.isChaseActive = true; // Control chase activation

    // Start the chase behavior for an NPC
    Game_Event.prototype.startChase = function() {
	this.isChaseActive = true;
  

        const playerX = $gamePlayer.x;
        const playerY = $gamePlayer.y;
        const npcX = this.x;
        const npcY = this.y;

        const distance = Math.abs(playerX - npcX) + Math.abs(playerY - npcY);

        // Check if the player is within range, and if the chase has not started yet
	this.hasStartedChase = true; // Mark that the chase has started
        if (!this.hasStartedChase && distance <= range) {
            
        }

        // If chase has started, continue chasing the player
        if (this.hasStartedChase) {
            this.moveTowardPlayer();

            // Check if the NPC has reached the player
            if (playerX === npcX && playerY === npcY) {
                this.stopChase(); // Stop chasing when NPC reaches player
            }
        }
    };

    // Stop the chase behavior for an NPC
    Game_Event.prototype.stopChase = function() {
        this.hasStartedChase = false;
        this.isChaseActive = false; // Deactivate chase
       
    };

    // The NPC will move toward the player's position
    Game_Event.prototype.moveTowardPlayer = function() {
        this.moveTowardCharacter($gamePlayer); // Built-in function to move toward player
    };

    // Plugin command to activate chase behavior
    PluginManager.registerCommand('ActivateChase', function() {
        $gameMap.events().forEach(function(event) {
            if (event instanceof Game_Event) {
                event.isChaseActive = true;  // Enable chase behavior
                event.hasStartedChase = false;  // Reset chase state
            }
        });
    });

    // Plugin command to deactivate chase behavior
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

    // Set NPC event location and reset chase behavior
    Game_Interpreter.prototype.command205SetLocation = function(eventId, x, y) {
        $gameMap.events().forEach(function(event) {
            if (event.id === eventId) {
                event.setPosition(x, y); // Set the NPC's position
                event.hasStartedChase = false; // Reset chase state
            }
        });
    };

})();