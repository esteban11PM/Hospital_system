import { Routes } from '@angular/router';
import { CreateGameComponent } from './Game/create-game/create-game.component';
import { IndiceGameComponent } from './Game/indice-game/indice-game.component';
import { UpdateGameComponent } from './Game/update-game/update-game.component';
import { CreateGameAssignmentComponent } from './GameAssignment/create-game-assignment/create-game-assignment.component';
import { IndiceGameAssignmentComponent } from './GameAssignment/indice-game-assignment/indice-game-assignment.component';
import { UpdateGameAssignmentComponent } from './GameAssignment/update-game-assignment/update-game-assignment.component';
import { CreateGameStationComponent } from './GameStation/create-game-station/create-game-station.component';
import { IndiceGameStationComponent } from './GameStation/indice-game-station/indice-game-station.component';
import { UpdateGameStationComponent } from './GameStation/update-game-station/update-game-station.component';
import { CreateAccessoryComponent } from './Accessory/create-accessory/create-accessory.component';
import { IndiceAccessoryComponent } from './Accessory/indice-accessory/indice-accessory.component';
import { UpdateAccessoryComponent } from './Accessory/update-accessory/update-accessory.component';
import { IndiceGtAccessoryComponent } from './GTAccessory/indice-gt-accessory/indice-gt-accessory.component';
import { UpdateGtAccessoryComponent } from './GTAccessory/update-gt-accessory/update-gt-accessory.component';
import { CreateGtAccessoryComponent } from './GTAccessory/create-gt-accessory/create-gt-accessory.component';


export const SYSTEM: Routes = [
	{ path: '', redirectTo: 'game', pathMatch: 'full' },

	{ path: 'game', component: IndiceGameComponent },
	{ path: 'game/create', component: CreateGameComponent },
	{ path: 'game/update/:id', component: UpdateGameComponent },

	{ path: 'gamestation', component: IndiceGameStationComponent },
	{ path: 'gamestation/create', component: CreateGameStationComponent },
	{ path: 'gamestation/update/:id', component: UpdateGameStationComponent },

	{ path: 'accessory', component: IndiceAccessoryComponent },
	{ path: 'accessory/create', component: CreateAccessoryComponent },
	{ path: 'accessory/update/:id', component: UpdateAccessoryComponent },

	{ path: 'gameassignment', component: IndiceGameAssignmentComponent },
	{ path: 'gameassignment/create', component: CreateGameAssignmentComponent },
	{ path: 'gameassignment/update/:id', component: UpdateGameAssignmentComponent },

	{ path: 'gamestationaccessory', component: IndiceGtAccessoryComponent },
	{ path: 'gamestationaccessory/create', component: CreateGtAccessoryComponent },
	{ path: 'gamestationaccessory/update/:id', component: UpdateGtAccessoryComponent },

];
