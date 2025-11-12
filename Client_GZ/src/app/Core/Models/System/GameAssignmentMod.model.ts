// ==================================================
// Modelos: Asignación de Juegos a Estaciones
// ==================================================
// Define la relación entre un juego y una estación de juego, incluyendo
// nombres de referencia para mostrar en listados y formularios.

export interface GameAssignmentMod {
  id: number;
  active: boolean;
  gameId: number;
  gameName: string;
  gameStationId: number;
  gameStationName: string;
}

export interface GameAssignmentOptionsMod {
  id: number;
  active: boolean;
  gameId: number;
  gameStationId: number;
}
