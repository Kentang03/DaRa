//=============================================================================
// Change_Fade_Time
//-----------------------------------------------------------------------------
// This plugin allows handling the time of fade in/out.
//=============================================================================


/*:
 @plugindesc This plugin allows handling the time of fade in/out.
 @author King Gerar
 
 @param fadeTime
 @text Time for fade in/out.
 @default 24
 @min 1
 @type number
 
 @help
 ------------------------------------------------------------------------------
 Added Functions: none.
 Overwritten Functions: Game_Interpreter.fadeSpeed
 Aliased Functions: none.
*/


(function() {
	'use strict';
	
	window.Imported = window.Imported || {};
	
	Imported.Change_Fade_Time = true;
	
	var Change_Fade_Time = {
		fadeTime: Number(PluginManager.parameters('Change_Fade_Time')['fadeTime'])
	};
	
	Game_Interpreter.prototype.fadeSpeed = function() {
    return Change_Fade_Time.fadeTime;
	};
}());
