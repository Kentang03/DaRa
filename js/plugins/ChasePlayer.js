/*:
 * @plugindesc A* Pathfinding with Smooth Movement for RPG Maker MV
 * @author Daffa
 *
 * @help
 * Use `this.findPathToPlayer();` inside an event to make it move towards the player.
 */

(function() 
{
    Game_Event.prototype.hasStartedChase = false;
    var _Game_Character_initMembers = Game_Character.prototype.initMembers;
    var _Game_Character_update = Game_Character.prototype.update;
    // Add path property to track current path
    Game_Character.prototype.initMembers = function() {
        _Game_Character_initMembers.call(this);
        this._path = null;
    };

    Game_Event.prototype.initialX = null;
    Game_Event.prototype.initialY = null;

    // Override the initialize method to store the initial position
    const _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.call(this, mapId, eventId);
        this.initialX = this.x;
        this.initialY = this.y;
    };

    Game_Character.prototype.findPathTo = function(goalX, goalY) {
        const startNode = { x: this.x, y: this.y, g: 0, h: 0, f: 0, parent: null };
        const openList = [startNode];
        const closedList = [];
        const tilemapWidth = $gameMap.width();
        const tilemapHeight = $gameMap.height();

        function getNeighbors(node) {
            const neighbors = [];
            const directions = [
                { x: 0, y: -1, dir: 8 },  // Up
                { x: 1, y: 0, dir: 6 },   // Right
                { x: 0, y: 1, dir: 2 },   // Down
                { x: -1, y: 0, dir: 4 }   // Left
            ];

            for (const d of directions) {
                const nx = node.x + d.x;
                const ny = node.y + d.y;
                if (nx >= 0 && ny >= 0 && nx < tilemapWidth && ny < tilemapHeight && 
                    $gameMap.isPassable(nx, ny, d.dir)) {
                    neighbors.push({ x: nx, y: ny, dir: d.dir });
                }
            }
            return neighbors;
        }

        function heuristic(a, b) {
            return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
        }

        while (openList.length > 0) {
            openList.sort((a, b) => a.f - b.f);
            const currentNode = openList.shift();
            closedList.push(currentNode);

            if (currentNode.x === goalX && currentNode.y === goalY) {
                const path = [];
                let node = currentNode;
                while (node.parent) {
                    path.unshift(node.dir);  // Store directions instead of full nodes
                    node = node.parent;
                }
                return path;
            }

            for (const neighbor of getNeighbors(currentNode)) {
                if (closedList.find(n => n.x === neighbor.x && n.y === neighbor.y)) continue;

                const g = currentNode.g + 1;
                const h = heuristic(neighbor, { x: goalX, y: goalY });
                const f = g + h;

                let existingNode = openList.find(n => n.x === neighbor.x && n.y === neighbor.y);
                if (existingNode) {
                    if (g < existingNode.g) {
                        existingNode.g = g;
                        existingNode.f = f;
                        existingNode.parent = currentNode;
                    }
                } else {
                    openList.push({ 
                        x: neighbor.x, 
                        y: neighbor.y, 
                        g, 
                        h, 
                        f, 
                        parent: currentNode,
                        dir: neighbor.dir 
                    });
                }
            }
        }
        return null;
    };

    Game_Character.prototype.update = function() {
        _Game_Character_update.call(this); // Gunakan reference yang disimpan
        
        if (this._path && this._path.length > 0 && !this.isMoving()) {
            const nextDir = this._path.shift();
            if ($gameMap.isPassable(this.x, this.y, nextDir)) {
                this.moveStraight(nextDir);
            } else {
                this._path = null;
            }
        }
    };  

    Game_Character.prototype.followPath = function(path) {
        if (!path || path.length === 0) return;
        this._path = path;
    };

    Game_Character.prototype.findPathToPlayer = function(maxRange) {
        const playerX = $gamePlayer.x;
        const playerY = $gamePlayer.y;

        const npcX = this.x;
        const npcY = this.y;

        const distance = Math.abs(playerX - npcX) + Math.abs(playerY - npcY);
        if (!this.hasStartedChase && distance <= maxRange) {
            this.hasStartedChase = true; 
        } else if (this.hasStartedChase && distance > maxRange) {
            this.hasStartedChase = false;
        }

        if (this.hasStartedChase) {
            const path = this.findPathTo(playerX, playerY);
            this.followPath(path);
        } else {
            // If chase is not active, move back to initial position step by step
            this.moveTowardInitialPosition();
        }
        
    };

    Game_Event.prototype.moveTowardInitialPosition = function() {
        const npcX = this.x;
        const npcY = this.y;

        // If NPC is already at the initial position, do nothing
        if (npcX === this.initialX && npcY === this.initialY) return;

        let possibleDirections = [];

        // Check if NPC can move in the direction towards the initial position
        if (npcX < this.initialX && $gameMap.isPassable(npcX + 1, npcY, 6)) possibleDirections.push(6); // Right
        if (npcX > this.initialX && $gameMap.isPassable(npcX - 1, npcY, 4)) possibleDirections.push(4); // Left
        if (npcY < this.initialY && $gameMap.isPassable(npcX, npcY + 1, 2)) possibleDirections.push(2); // Down
        if (npcY > this.initialY && $gameMap.isPassable(npcX, npcY - 1, 8)) possibleDirections.push(8); // Up

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

    // Store original update method
    Game_Character.prototype._originalUpdate = Game_Character.prototype.update;
})();