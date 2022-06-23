import { Inject, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ISelectorOptions, SelectorBaseService } from '@sneat/components';
import { ContactRole } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext, ITeamContext } from '@sneat/team/models';
import { ContactSelectorComponent } from './contact-selector.component';

export interface IContactSelectorOptions extends ISelectorOptions<IContactContext> {
	readonly team: ITeamContext;
	readonly role?: ContactRole;
}

@Injectable()
export class ContactSelectorService extends SelectorBaseService<IContactContext> {
	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		modalController: ModalController,
	) {
		super(ContactSelectorComponent, errorLogger, modalController);
	}

	selectSingleContactsInModal(options: IContactSelectorOptions): Promise<IContactContext> {
		return this.selectSingleInModal(options);
	}
}
