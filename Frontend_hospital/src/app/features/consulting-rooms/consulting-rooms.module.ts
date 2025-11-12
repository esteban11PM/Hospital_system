import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from '../../shared/material.module';
import { ConsultingRoomListComponent } from './consulting-room-list/consulting-room-list.component';

const routes: Routes = [
  { path: '', component: ConsultingRoomListComponent }
];

@NgModule({
  declarations: [
    ConsultingRoomListComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ]
})
export class ConsultingRoomsModule { }