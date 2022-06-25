import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { ContactRole } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext, ITeamContext } from '@sneat/team/models';
import { ContactSelectorService, IContactSelectorOptions } from '../contact-selector/contact-selector.service';

@Component({
	selector: 'sneat-contact-input',
	templateUrl: './contact-input.component.html',
})
export class ContactInputComponent {

	@Input() canReset = false;
	@Input() readonly = false;
	@Input() team?: ITeamContext;
	@Input() label?: string;
	@Input() labelPosition?: 'fixed' | 'stacked' | 'floating';
	@Input() role?: ContactRole;


	@Input() contact?: IContactContext;
	@Output() contactChange = new EventEmitter<IContactContext>();


	get labelText(): string {
		return this.label
			|| this.role && `${this.role[0].toUpperCase()}${this.role.substr(1)}`
			|| 'Contact';
	}

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly contactSelectorService: ContactSelectorService,
	) {

	}

	get contactLink(): string {
		return `/company/${this.team?.type}/${this.team?.id}/contact/${this.contact?.id}` || '';
	}

	reset(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		this.contact = undefined;
		this.contactChange.emit(undefined);
	}

	openContactSelector(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		console.log('ContactInputComponent.openContactSelector()');
		if (!this.team) {
			this.errorLogger.logError('ContactInputComponent.openContactSelector(): team is required', undefined);
			return;
		}
		const selectorOptions: IContactSelectorOptions = {
			team: this.team,
			role: this.role,
		};
		this.contactSelectorService.selectSingleContactsInModal(selectorOptions)
			.then(contact => {
				console.log('ContactInputComponent.openContactSelector() contact:', contact);
				if (contact) {
					this.contactChange.emit(contact);
				}
			})
			.catch(this.errorLogger.logErrorHandler('failed to open contact selector'));
	}

}