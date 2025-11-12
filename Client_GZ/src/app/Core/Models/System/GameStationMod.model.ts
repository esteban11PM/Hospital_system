// ==================================================
// Modelos: Estaciones de Juego
// ==================================================
// Representa las estaciones o consolas disponibles en el sistema,
// incluyendo su información básica y estado de actividad.

export interface GameStationMod {
	id: number;
	name: string;
	description: string;
	active: boolean;
}
