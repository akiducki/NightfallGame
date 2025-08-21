// Utility functions for game logic

export function generateZombieId(): string {
  return `zombie_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getRandomSpawnPosition(gamePhase: string): [number, number, number] {
  switch (gamePhase) {
    case 'prologue':
      // Spawn around the edges of the room, but further away from center
      const side = Math.floor(Math.random() * 4);
      switch (side) {
        case 0: return [Math.random() * 6 - 3, 1, -4.8]; // Front wall - further out
        case 1: return [Math.random() * 6 - 3, 1, 4.8];  // Back wall - further out
        case 2: return [-4.8, 1, Math.random() * 6 - 3]; // Left wall - further out
        case 3: return [4.8, 1, Math.random() * 6 - 3];  // Right wall - further out
        default: return [0, 1, -4.8];
      }
      
    case 'chapter1':
    case 'chapter2':
      // Spawn along the sides of the street, ahead of player
      const leftSide = Math.random() < 0.5;
      const x = leftSide ? -12 : 12;
      const z = Math.random() * 30 - 50; // Spawn ahead
      return [x, 1, z];
      
    case 'chapter3':
      // Spawn around the cave edges
      const angle = Math.random() * Math.PI * 2;
      const distance = 8;
      const spawnX = Math.cos(angle) * distance;
      const spawnZ = Math.sin(angle) * distance;
      return [spawnX, 1, spawnZ];
      
    default:
      return [0, 1, -10];
  }
}

export function calculateDistance(
  pos1: [number, number, number], 
  pos2: [number, number, number]
): number {
  return Math.sqrt(
    Math.pow(pos1[0] - pos2[0], 2) +
    Math.pow(pos1[1] - pos2[1], 2) +
    Math.pow(pos1[2] - pos2[2], 2)
  );
}

export function normalizeVector(vector: [number, number, number]): [number, number, number] {
  const length = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2]);
  if (length === 0) return [0, 0, 0];
  return [vector[0] / length, vector[1] / length, vector[2] / length];
}

export function getDirectionToTarget(
  from: [number, number, number],
  to: [number, number, number]
): [number, number, number] {
  const direction: [number, number, number] = [
    to[0] - from[0],
    to[1] - from[1],
    to[2] - from[2]
  ];
  return normalizeVector(direction);
}

// Check if two axis-aligned bounding boxes intersect
export function checkAABBCollision(
  pos1: [number, number, number],
  size1: [number, number, number],
  pos2: [number, number, number],
  size2: [number, number, number]
): boolean {
  return (
    pos1[0] - size1[0]/2 < pos2[0] + size2[0]/2 &&
    pos1[0] + size1[0]/2 > pos2[0] - size2[0]/2 &&
    pos1[1] - size1[1]/2 < pos2[1] + size2[1]/2 &&
    pos1[1] + size1[1]/2 > pos2[1] - size2[1]/2 &&
    pos1[2] - size1[2]/2 < pos2[2] + size2[2]/2 &&
    pos1[2] + size1[2]/2 > pos2[2] - size2[2]/2
  );
}
