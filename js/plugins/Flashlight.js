/*:
 * @plugindesc Pitch Black Screen with Visible Character Sprite - Senter Plugin
 * @help
 * This plugin creates a pitch-black screen with only the character sprite visible.
 * 
 * Plugin Commands:
 * - SenterOn: Turn on the flashlight (circular light effect centered on the player).
 * - SenterOff: Turn off the flashlight (pitch black except character sprite).
 * 
 * Script Calls to Activate/Deactivate Plugin:
 * - Activate Plugin:
 *   $gameSystem.activateSenterPlugin();
 * - Deactivate Plugin:
 *   $gameSystem.deactivateSenterPlugin();
 * 
 * Usage:
 * Use the script call $gameSystem.activateSenterPlugin(); to activate the plugin.
 * Use the script call $gameSystem.deactivateSenterPlugin(); to deactivate it.
 * Once activated, use the plugin command "SenterOn" to turn on the flashlight.
 * Use the plugin command "SenterOff" to turn it off.
 */

(function() {
    let flashlightActive = false; // Tracks if flashlight is on
    let pluginActive = false;     // Tracks if plugin is active
    const tileSize = 48;          // Tile size in pixels
    const flashlightRadius = 2.5 * tileSize; // 5x5 tile range (2.5 tiles * 48 pixels)

    // Create the flashlight layer
    const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function() {
        _Spriteset_Map_createLowerLayer.call(this);
        this.createFlashlightLayer();
    };

    Spriteset_Map.prototype.createFlashlightLayer = function() {
        this._flashlightBitmap = new Bitmap(Graphics.width, Graphics.height);
        this._flashlightSprite = new Sprite(this._flashlightBitmap);
        this._flashlightSprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        this.addChild(this._flashlightSprite);
    };

    // Update the flashlight layer
    const _Spriteset_Map_update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map_update.call(this);
        if (pluginActive) {
            if (flashlightActive) {
                this.updateFlashlight();
            } else {
                this.updatePitchBlack();
            }
        } else {
            this.clearFlashlight();
        }
    };

    Spriteset_Map.prototype.updateFlashlight = function() {
        const player = $gamePlayer;
        const px = player.screenX();
        const py = player.screenY() - (tileSize / 2); // Adjust for character sprite height

        const bitmap = this._flashlightBitmap;
        bitmap.clear();
        bitmap.fillAll('black');

        bitmap.context.save();
        bitmap.context.globalCompositeOperation = 'destination-out';

        // Draw circular light
        const gradient = bitmap.context.createRadialGradient(px, py, 0, px, py, flashlightRadius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        bitmap.context.fillStyle = gradient;
        bitmap.context.beginPath();
        bitmap.context.arc(px, py, flashlightRadius, 0, Math.PI * 2);
        bitmap.context.fill();

        bitmap.context.restore();
        bitmap._setDirty();
    };

    Spriteset_Map.prototype.updatePitchBlack = function() {
        const bitmap = this._flashlightBitmap;
        bitmap.clear();
        bitmap.fillAll('black');
        bitmap._setDirty();
    };

    Spriteset_Map.prototype.clearFlashlight = function() {
        const bitmap = this._flashlightBitmap;
        bitmap.clear();
    };

    // Plugin commands
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (pluginActive) {
            if (command === 'SenterOn') {
                flashlightActive = true;
            } else if (command === 'SenterOff') {
                flashlightActive = false;
            }
        }
    };

    // Script calls to activate/deactivate the plugin
    Game_System.prototype.activateSenterPlugin = function() {
        pluginActive = true;
    };

    Game_System.prototype.deactivateSenterPlugin = function() {
        pluginActive = false;
        flashlightActive = false;
    };
})();
