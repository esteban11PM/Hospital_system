import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from "../../Components/Shared/menu/menu.component";
import { AuthService } from '../../Core/Services/Auth/auth.service';

@Component({
	selector: 'app-layout',
	standalone: true,
	imports: [RouterOutlet, MenuComponent],
	templateUrl: './layout.component.html',
	styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {

	constructor(private authService: AuthService) { }

	ngOnInit(): void {
		if (this.authService.isAuthenticated()) {
			this.authService.scheduleProactiveRefresh();
		}
	}
}
