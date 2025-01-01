/*:
 * @target MV
 * @plugindesc Increases the maximum number of pictures to 500.
 * @help This plugin increases the maximum number of pictures that can be used in RPG Maker MV from the default 100 to 500.
 *
 * Usage:
 * - Add this plugin to your project.
 * - No further configuration required.
 *
 * Free to use and modify for any project. No credit required.
 */

(function() {
    // Override the default maxPictures method to return 500 instead of 100
    Game_Screen.prototype.maxPictures = function() {
        return 500;
    };
})();
