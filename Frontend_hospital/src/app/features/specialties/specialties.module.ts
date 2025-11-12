import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from '../../shared/material.module';
import { SpecialtyListComponent } from './specialty-list/specialty-list.component';

const routes: Routes = [
  { path: '', component: SpecialtyListComponent }
];

@NgModule({
  declarations: [
    SpecialtyListComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ]
})
export class SpecialtiesModule { }