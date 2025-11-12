// ==================================================
// Modelos: Accesorios
// ==================================================
// Define la estructura base para representar los accesorios disponibles
// en el sistema, incluyendo su información descriptiva y estado activo.

export interface AccessoryMod {
  id: number;
  name: string;
  description: string;
  active: boolean;
}
