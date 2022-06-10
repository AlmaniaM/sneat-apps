import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthStatus, ISneatAuthState, SneatAuthStateService } from '@sneat/auth';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'sneat-sneat-app-home-page',
	templateUrl: './sneat-app-home-page.component.html',
	styleUrls: ['./sneat-app-home-page.component.scss'],
})
export class SneatAppHomePageComponent implements OnDestroy {

	readonly destroyed = new Subject<void>();

	public authStatus?: AuthStatus;

	constructor(
		authStateService: SneatAuthStateService,
	) {
		authStateService.authState
			.pipe(takeUntil(this.destroyed))
			.subscribe({
				next: authState => {
					this.authStatus = authState.status;
				},
			});
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

}