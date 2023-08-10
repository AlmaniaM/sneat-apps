import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactComponentBaseParams } from '@sneat/contactus-shared';
import { IContactContext } from '@sneat/team/models';
import { ContactBasePage } from '../contact-base-page';

@Component({
	selector: 'sneat-new-location-page',
	templateUrl: './new-location-page.component.html',
})
export class NewLocationPageComponent extends ContactBasePage {

	newLocation: IContactContext = { id: '', dto: { type: 'location' }, team: { id: '' } };

	constructor(
		route: ActivatedRoute,
		params: ContactComponentBaseParams,
		// private readonly contactService: ContactService,
	) {
		super('ContactPageComponent', route, params);
		this.defaultBackPage = 'contacts';
	}

	protected override onTeamDtoChanged() {
		super.onTeamDtoChanged();
		// if (this.team?.dto?.countryID && !this.newLocationDto.countryID) {
		// 	this.newLocationDto = { ...this.newLocationDto, countryID: this.team.dto.countryID };
		// }
	}

	onContactChanged(contact: IContactContext): void {
		this.newLocation = contact;
	}

	onContactCreated(contact: IContactContext): void {
		this.newLocation = contact;
		const team = this.team;
		if (!team) {
			throw new Error('Team is not defined');
		}
		const url = this.teamPageUrl(`contact/${this.contact?.id}`);
		if (url) {
			this.navController
				.navigateBack(url)
				.catch(this.errorLogger.logErrorHandler('failed navigate to parent contact'));
		}
	}
}
