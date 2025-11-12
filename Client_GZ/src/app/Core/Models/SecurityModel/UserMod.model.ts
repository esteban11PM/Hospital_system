// ==================================================
// Modelos: Usuario del sistema
// ==================================================
// Estructuras principales para representar usuarios, incluyendo
// opciones simplificadas, actualizaciones parciales y relación con compañías.

export interface UserMod {
  id: number;
  username: string;
  password: string;
  active: boolean;
  personId: number;
  personName: string;
	roleId: number;
  roleName: string;
}

export interface UserOptionsMod {
  id: number;
  username: string;
  password?: string;
  active: boolean;
  personId: number;
  roleId: number;
}
