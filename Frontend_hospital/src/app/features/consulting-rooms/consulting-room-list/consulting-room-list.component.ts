import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConsultingRoomService } from '../../../core/services/consulting-room.service';
import { ConsultingRoom } from '../../../core/models/medical.models';

@Component({
  selector: 'app-consulting-room-list',
  standalone: false,
  templateUrl: './consulting-room-list.component.html',
  styleUrls: ['./consulting-room-list.component.scss']
})
export class ConsultingRoomListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<ConsultingRoom>();
  isLoading = false;

  constructor(private consultingRoomService: ConsultingRoomService) {}

  ngOnInit(): void {
    this.loadConsultingRooms();
  }

  loadConsultingRooms(): void {
    this.isLoading = true;
    this.consultingRoomService.getConsultingRooms().subscribe({
      next: (response) => {
        this.dataSource.data = response || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading consulting rooms:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}