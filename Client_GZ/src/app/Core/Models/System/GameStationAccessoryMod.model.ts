// ==================================================
// Modelos: Relación Estación de Juego - Accesorio
// ==================================================
// Representa la asociación entre una estación de juego y sus accesorios,
// permitiendo identificar los elementos asignados a cada estación.

export interface GameStationAccessoryMod {
	id: number;
	active: boolean;
	gameStationId: number;
	gameStationName: string;
	accessoryId: number;
	accessoryName: string;
}

export interface GameStationAccessoryOptionsMod {
	id: number;
	active: boolean;
	gameStationId: number;
	accessoryId: number;
}
