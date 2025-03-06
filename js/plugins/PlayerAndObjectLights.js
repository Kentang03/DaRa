/*:
 * @plugindesc Unified Flashlight and Object Light Source Plugin with Enable Command
 * @help
 * This plugin provides functionality for:
 * 1. A flashlight effect centered on the player.
 * 2. Custom light sources attached to specific events (objects).
 * 3. Enable/disable lighting per map using a plugin command.
 * 
 * Plugin Commands:
 * - Enable Light System: 
 *   EnableLighting
 * - Disable Light System:
 *   DisableLighting
 * 
 * Script Calls (unchanged):
 * - Activate Player Flashlight:
 *   $gameSystem.activatePlayerFlashlight(radius);
 * - Deactivate Player Flashlight:
 *   $gameSystem.deactivatePlayerFlashlight();
 * - Activate Light Source for an Event:
 *   $gameSystem.activateLightSource(eventId, radius);
 * - Deactivate Light Source for an Event:
 *   $gameSystem.deactivateLightSource(eventId);
 */

(function() {
    const tileSize = 48;
    let lightingEnabled = false; // NEW: Control whether lighting is active
    let activePlayerFlashlight = false;
    let playerFlashlightRadius = 0;
    let activeLightSources = {}; // Stores active light sources for events

    // Register plugin commands
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === "EnableLighting") {
            lightingEnabled = true;
        } else if (command === "DisableLighting") {
            lightingEnabled = false;
        }
    };

    // Create the light layer
    const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function() {
        _Spriteset_Map_createLowerLayer.call(this);
        this.createLightLayer();
    };

    Spriteset_Map.prototype.createLightLayer = function() {
        this._lightBitmap = new Bitmap(Graphics.width, Graphics.height);
        this._lightSprite = new Sprite(this._lightBitmap);
        this._lightSprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        this.addChild(this._lightSprite);
    };

    // Update the light layer
    const _Spriteset_Map_update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map_update.call(this);
        if (lightingEnabled) {
            this.updateLightSources();
        } else {
            this.clearLightLayer();
        }
    };

    Spriteset_Map.prototype.updateLightSources = function() {
        const bitmap = this._lightBitmap;
        bitmap.clear();
        bitmap.fillAll('black');

        bitmap.context.save();
        bitmap.context.globalCompositeOperation = 'destination-out';

        // Player flashlight
        if (activePlayerFlashlight) {
            const px = $gamePlayer.screenX();
            const py = $gamePlayer.screenY() - tileSize / 2;
            this.drawLight(bitmap, px, py, playerFlashlightRadius);
        }

        // Event light sources
        for (const [eventId, radius] of Object.entries(activeLightSources)) {
            const event = $gameMap.event(Number(eventId));
            if (event) {
                const ex = event.screenX();
                const ey = event.screenY() - tileSize / 2;
                this.drawLight(bitmap, ex, ey, radius);
            }
        }

        bitmap.context.restore();
        bitmap._setDirty();
    };

    Spriteset_Map.prototype.drawLight = function(bitmap, x, y, radius) {
        const gradient = bitmap.context.createRadialGradient(x, y, 0, x, y, radius * tileSize);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        bitmap.context.fillStyle = gradient;
        bitmap.context.beginPath();
        bitmap.context.arc(x, y, radius * tileSize, 0, Math.PI * 2);
        bitmap.context.fill();
    };

    Spriteset_Map.prototype.clearLightLayer = function() {
        this._lightBitmap.clear(); // NEW: Clears lighting when disabled
    };

    // Game_System functions for managing lights
    Game_System.prototype.activatePlayerFlashlight = function(radius) {
        if (lightingEnabled) {
            activePlayerFlashlight = true;
            playerFlashlightRadius = radius;
        }
    };

    Game_System.prototype.deactivatePlayerFlashlight = function() {
        activePlayerFlashlight = false;
    };

    Game_System.prototype.activateLightSource = function(eventId, radius) {
        if (lightingEnabled) {
            activeLightSources[eventId] = radius;
        }
    };

    Game_System.prototype.deactivateLightSource = function(eventId) {
        delete activeLightSources[eventId];
    };
})();
