import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../../Core/Services/Auth/auth.service';
import { isAdminRole } from '../../../Core/Utils/auth.utils';
import { MatCard } from "@angular/material/card";

@Component({
	selector: 'app-base-table',
	standalone: true,
	imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatCard
],
	templateUrl: './base-table.component.html',
	styleUrl: './base-table.component.css'
})
export class BaseTableComponent implements OnChanges {

	// Inyección de servicios propios del proyecto
	private readonly authService = inject(AuthService);

	// Inputs principales del componente
	@Input() data: any[] = [];
	@Input() columns: string[] = [];
	@Input() tooltipColumns: string[] = [];
	@Input() statusLabels: { [key in 'true' | 'false']: string } = {
		true: 'Active',
		false: 'Inactive'
	};

	// Inputs de paginación
	@Input() showPagination: boolean = true;
	@Input() pageSize: number = 5;
	@Input() pageSizeOptions: number[] = [5, 10, 25, 50];
	@Input() pageIndex: number = 0;

	// Outputs de eventos emitidos al componente padre
	@Output() onDelete = new EventEmitter<any>();
	@Output() onEdit = new EventEmitter<any>();
	@Output() onPageChange = new EventEmitter<PageEvent>();

	dataSource = new MatTableDataSource<any>();
	columnasMostrar: string[] = [];
	paginatedData: any[] = [];

	ngOnChanges(changes: SimpleChanges): void {
		this.dataSource.data = this.data || [];

		const role = this.authService.getRole();
		const isAdmin = isAdminRole(role);

		// Solo agregar "active" si el rol es Administrador
		const filteredColumns = isAdmin
			? this.columns
			: this.columns.filter(col => col !== 'active');

		this.columnasMostrar = [...filteredColumns, 'actions'];

		// Actualizar datos paginados cuando cambian los datos o la paginación
		if (changes['data'] || changes['pageSize'] || changes['pageIndex']) {
			this.updatePaginatedData();
		}
	}

	/**
	 * Actualiza los datos paginados basados en la página actual
	 */
	private updatePaginatedData(): void {
		if (!this.showPagination) {
			this.paginatedData = this.data;
			this.dataSource.data = this.data;
			return;
		}

		const startIndex = this.pageIndex * this.pageSize;
		const endIndex = startIndex + this.pageSize;
		this.paginatedData = this.data.slice(startIndex, endIndex);
		this.dataSource.data = this.paginatedData;
	}

	/**
	 * Maneja el cambio de página
	 */
	onPageChanges(event: PageEvent): void {
		this.pageIndex = event.pageIndex;
		this.pageSize = event.pageSize;
		this.updatePaginatedData();

		// Emitir evento al componente padre
		this.onPageChange.emit(event);
	}

	/**
	 * Obtiene el índice real de la fila considerando la paginación
	 */
	getRowIndex(index: number): number {
		if (!this.showPagination) {
			return index + 1;
		}
		return (this.pageIndex * this.pageSize) + index + 1;
	}

	/**
	 * Obtiene el rango de registros mostrados
	 */
	getDisplayedRange(): string {
		if (!this.showPagination || this.data.length === 0) {
			return `1-${this.data.length}`;
		}

		const start = (this.pageIndex * this.pageSize) + 1;
		const end = Math.min((this.pageIndex + 1) * this.pageSize, this.data.length);

		return `${start}-${end}`;
	}

	getValue(item: any, path: string): any {
		const value = path.split('.').reduce((acc, key) => acc?.[key], item);
		if (path === 'active') {
			return this.statusLabels[String(value) as 'true' | 'false'];
		}
		return value;
	}

	getStatusClass(column: string, element: any): string {
		if (column !== 'active') return '';
		return element.active ? 'status-active' : 'status-inactive';
	}

	deleteItem(element: any) {
		this.onDelete.emit(element);
	}

	editItem(element: any) {
		this.onEdit.emit(element);
	}

	// Determina si debe mostrarse un tooltip para una celda específica
	shouldShowTooltip(column: string, element: any): boolean {
		const value = this.getValue(element, column);
		return this.tooltipColumns.includes(column) && typeof value === 'string' && value.length > 12;
	}

	/**
	 * Esta función trunca el texto si cumple la misma condición:
	 * Muestra solo los primeros 12 caracteres seguidos de ... si:
	 * la columna está en tooltipColumns.
	 * El valor es un string largo (> 15).
	 */
	truncate(value: any, column: string): string {
		if (this.tooltipColumns.includes(column) && typeof value === 'string' && value.length > 12) {
			return value.slice(0, 10) + '...';
		}
		return value;
	}
}
