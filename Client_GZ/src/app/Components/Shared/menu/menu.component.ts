import { Component, ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LogoutButtonDirective } from '../../../Core/Directives/logout-button.directive';

@Component({
	selector: 'app-menu',
	standalone: true,
	imports: [
		MatSidenavModule,
		MatToolbarModule,
		MatButtonModule,
		MatIconModule,
		MatListModule,
		RouterLink,
		RouterLinkActive,
		LogoutButtonDirective
	],
	templateUrl: './menu.component.html',
	styleUrl: './menu.component.css'
})
export class MenuComponent {
    isSidebarOpen = false;

    constructor(private cdRef: ChangeDetectorRef) { }

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
        // Forzar detección de cambios (esto está bien)
        this.cdRef.detectChanges();
    }

    closeSidebar() {
        this.isSidebarOpen = false;
        this.cdRef.detectChanges();
    }
}
