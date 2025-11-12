// ==================================================
// Modelos: Juegos
// ==================================================
// Contiene la estructura base para representar los juegos registrados
// en el sistema, junto con su descripción y estado.

export interface GameMod {
  id: number;
  name: string;
  description: string;
  active: boolean;
}
