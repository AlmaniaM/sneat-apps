import { Component, Inject } from '@angular/core';
import { ISneatAuthState, SneatAuthStateService } from '../sneat-auth-state-service';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { NavController } from '@ionic/angular';

@Component({
	selector: 'sneat-auth-menu-item',
	templateUrl: './auth-menu-item.component.html',
})
export class AuthMenuItemComponent {

	public authState?: ISneatAuthState;

	constructor(
		@Inject(ErrorLogger)
		private readonly errorLogger: IErrorLogger,
		private readonly navCtrl: NavController,
		readonly authStateService: SneatAuthStateService,
	) {
		authStateService.authState.subscribe({
			next: authState => this.authState = authState,
			error: errorLogger.logErrorHandler('failed to get auth state'),
		});
	}

	public logout(): void {
		try {
			this.authStateService
				.signOut()
				.then(() => {
					this.navCtrl
						.navigateBack('/signed-out')
						.catch(
							this.errorLogger.logErrorHandler(
								'Failed to navigate to signed out page',
							),
						);
				})
				.catch(this.errorLogger.logErrorHandler('Failed to sign out'));
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to logout');
		}
	}

}
