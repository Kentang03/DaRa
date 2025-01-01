/*:
 * @plugindesc Change Default Player Speed
 * @author YourName
 *
 * @help This plugin changes the default movement speed of the player.
 * No plugin commands are required.
 */

(function() {
    const DEFAULT_SPEED = 3; // Change this number to set the speed (Default is 4)

    const _Game_Player_initialize = Game_Player.prototype.initialize;
    Game_Player.prototype.initialize = function() {
        _Game_Player_initialize.call(this);
        this.setMoveSpeed(DEFAULT_SPEED);
    };
})();
