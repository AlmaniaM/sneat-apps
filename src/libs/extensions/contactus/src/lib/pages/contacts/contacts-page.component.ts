//tslint:disable:no-unsafe-any
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { listItemAnimations } from '@sneat/core';
import { ContactType, IMemberGroupDto } from '@sneat/dto';
import { TeamComponentBaseParams, TeamItemBaseComponent } from '@sneat/team/components';
import { IContactContext } from '@sneat/team/models';
import { Subscription } from 'rxjs';
import { ContactService } from '../../contact.service';

@Component({
	selector: 'sneat-contacts-page',
	templateUrl: './contacts-page.component.html',
	providers: [TeamComponentBaseParams],
	animations: [listItemAnimations],
})
export class ContactsPageComponent extends TeamItemBaseComponent {

	public allContacts: IContactContext[];
	public contacts?: IContactContext[];
	public groups: IMemberGroupDto[] = [];
	public segment: 'list' | 'groups' = 'list';
	public filter = '';
	public role?: ContactType;
	private contactsSubscription?: Subscription;

	constructor(
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		private readonly contactsService: ContactService,
	) {
		super('ContactsPageComponent', route, params, '');
		const role = location.pathname.match(/(applicant|landlord|tenant)/);
		if (role) {
			this.role = role[1] as ContactType;
		}
		this.allContacts = window.history.state.contacts as IContactContext[];

		if (this.allContacts) {
			this.applyFilter('', this.role);
		}
		this.teamIDChanged$.subscribe({
			next: this.onTeamIDChanged,
		});
	}

	get pageTitle(): string {
		if (this.role) {
			return `${this.role[0].toUpperCase() + this.role.substr(1)}s`;
		}
		return 'Contacts';
	}

	get titleIcon(): string {
		switch (this.role) {
			case 'tenant':
				return '🤠';
			case 'landlord':
				return '🤴';
			case 'applicant':
				return '🤔';
			default:
				return '📇';
		}
	}

	get canAdd(): boolean {
		// tslint:disable-next-line:no-this-assignment
		const { role } = this;
		return role !== 'tenant' && role !== 'landlord';
	}

	applyFilter(filter: string, role?: string): void {
		filter = filter && filter.toLowerCase();
		this.filter = filter;
		this.contacts = !filter && !role
			? this.allContacts
			: this.allContacts.filter(c =>
				(!filter || c.brief?.title && c.brief?.title.toLowerCase()
					.indexOf(filter) >= 0)
				&& (!role || c.dto?.roles && c?.dto.roles.includes(role)),
			);
	}

	goContact = (contact?: IContactContext): void => {
		if (!contact) {
			this.errorLogger.logError('no contact');
			return;
		}
		if (!this.team) {
			this.errorLogger.logError('no team');
			return;
		}
		this.teamParams.teamNavService.navigateForwardToTeamPage(this.team, `contact/${contact.id}`, {
			state: { contact },
		}).catch(this.errorLogger.logErrorHandler('failed to navigate to contact page'));
	};

	goNewContact = (): void => {
		if (!this.team) {
			return;
		}
		this.teamParams.teamNavService
			.navigateForwardToTeamPage(this.team, 'new-contact')
			.catch(this.errorLogger.logErrorHandler('failed to navigate to contact creation page'));
	};

	goMember(id: string, event: Event): boolean {
		event.stopPropagation();
		if (!this.team) {
			return false;
		}
		this.teamParams.teamNavService
			.navigateForwardToTeamPage(this.team, `member/${id}`, {
				state: {
					member: { id },
				},
			})
			.catch(this.errorLogger.logErrorHandler('failed to navigate to contact creation page'));
		return false;
	}

	goGroup(group: IMemberGroupDto): void {
		if (!this.team) {
			return;
		}
		this.teamParams.teamNavService
			.navigateForwardToTeamPage(this.team, `group/${group.id}`, {
				state: {
					group: group,
				},
			})
			.catch(this.errorLogger.logErrorHandler('failed to navigate to contact creation page'));
	}

	id(i: number, record: { id: string }): string {
		return record.id;
	}

	private readonly onTeamIDChanged = (): void => {
		console.log(`CommuneContactsPage.onTeamIDChanged()`);
		if (this.contactsSubscription) {
			this.contactsSubscription.unsubscribe();
		}
		if (!this.team) {
			return;
		}
		this.contactsSubscription = this.contactsService.watchByTeam(this.team)
			.pipe(
				this.takeUntilNeeded(),
			)
			.subscribe({
				next: contacts => {
					this.allContacts = contacts;
					this.applyFilter(this.filter, this.role);
				},
				error: this.errorLogger.logErrorHandler('failed to get team contacts'),
			});
	};

}
