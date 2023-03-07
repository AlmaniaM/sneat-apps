import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISelectItem } from '@sneat/components';
import { ContactRole } from '@sneat/dto';
import { ContactService } from '@sneat/extensions/contactus';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { IContactContext } from '@sneat/team/models';
import { first, takeUntil } from 'rxjs';

@Component({
	selector: 'sneat-new-logist-company-page',
	templateUrl: 'new-logist-company-page.component.html',
})
export class NewLogistCompanyPageComponent extends TeamBaseComponent implements OnDestroy {

	readonly contactTypes: ISelectItem[] = [
		{ id: 'agent', title: 'Agent', iconName: 'body-outline' },
		{ id: 'buyer', title: 'Buyer', iconName: 'cash-outline' },
		{ id: 'carrier', title: 'Carrier', iconName: 'train-outline' },
		{ id: 'dispatcher', title: 'Dispatcher', iconName: 'business-outline' },
		{ id: 'shipper', title: 'Shipper', iconName: 'boat-outline' },
	];

	protected contactRole?: ContactRole;

	constructor(
		route: ActivatedRoute,
		private readonly contactService: ContactService,
		teamParams: TeamComponentBaseParams,
	) {
		super('NewLogistCompanyPageComponent', route, teamParams);
		route.queryParamMap
			.pipe(
				first(),
				takeUntil(this.destroyed),
			)
			.subscribe({
				next: value => {
					this.contactRole = value.get('role') as ContactRole || undefined;
				},
			});
	}

	onContactCreated(contact: IContactContext): void {
		console.log('NewLogistCompanyPageComponent.onContactCreated()', contact);
		this.navController.pop().catch(() => {
			this.navController
				.navigateBack(['contacts'], { relativeTo: this.route })
				.catch(this.errorLogger.logErrorHandler('failed to navigate back to contacts page'));
		});
	}
}