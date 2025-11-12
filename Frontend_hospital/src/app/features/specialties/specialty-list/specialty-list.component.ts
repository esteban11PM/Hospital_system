import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SpecialtyService } from '../../../core/services/specialty.service';
import { Specialty } from '../../../core/models/medical.models';

@Component({
  selector: 'app-specialty-list',
  standalone: false,
  templateUrl: './specialty-list.component.html',
  styleUrls: ['./specialty-list.component.scss']
})
export class SpecialtyListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<Specialty>();
  isLoading = false;

  constructor(private specialtyService: SpecialtyService) {}

  ngOnInit(): void {
    this.loadSpecialties();
  }

  loadSpecialties(): void {
    this.isLoading = true;
    this.specialtyService.getSpecialties().subscribe({
      next: (response) => {
        this.dataSource.data = response || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading specialties:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}