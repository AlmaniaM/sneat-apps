import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ContactSelectorService, IContactSelectorOptions } from '@sneat/extensions/contactus';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';
import { FreightOrdersService, IDeleteCounterpartyRequest, IExpressOrderContext, IOrderCounterparty } from '../..';

@Component({
	selector: 'sneat-express-order-counterparties-card',
	templateUrl: './order-counterparties-card.component.html',
})
export class OrderCounterpartiesCardComponent implements OnChanges {
	@Input() team?: ITeamContext;
	@Input() order?: IExpressOrderContext;
	@Output() readonly orderChange = new EventEmitter<IExpressOrderContext>();
	@Input() readonly = false;
	@Input() plural = 'plural TO BE SET';
	@Input() singular = 'singular TO BE SET';
	@Input() role: 'dispatcher' = 'dispatcher';

	readonly deleting: IOrderCounterparty[] = [];

	public counterparties?: IOrderCounterparty[];

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly contactSelectorService: ContactSelectorService,
		private readonly ordersService: FreightOrdersService,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order']) {
			this.setCounterparties();
		}
	}

	private setCounterparties(): void {
		this.counterparties = this.order?.dto?.counterparties?.filter(counterparty => counterparty.role === this.role);
	}

	addCounterparty(event: Event): void {
		console.log('addCounterparty(), event:', event);
		event.stopPropagation();
		event.preventDefault();
		const team = this.team;
		if (!team) {
			this.errorLogger.logError('ContactInputComponent.openContactSelector(): team is required', undefined);
			return;
		}
		const selectorOptions: IContactSelectorOptions = {
			team,
			role: this.role,
			subType: 'location',
			excludeContacts: this.counterparties?.map(c => ({ id: c.contactID, team })),
		};
		this.contactSelectorService.selectSingleContactInModal(selectorOptions)
			.then(contact => {
				console.log('OrderCounterpartiesCardComponent.openContactSelector() contact:', contact);
				if (!this.order?.dto) {
					return;
				}
				if (!contact?.brief) {
					return;
				}
				const counterparty: IOrderCounterparty = {
					contactID: contact.id,
					title: contact.brief.title || contact.id,
					role: this.role,
					address: contact.brief.address,
					countryID: contact.brief.address?.countryID || '--',
				};
				this.order = {
					...this.order,
					dto: {
						...this.order.dto,
						counterparties: [
							...(this.order.dto.counterparties || []),
							counterparty,
						],
					},
				};
				this.setCounterparties();
				this.emitOrder();
			})
			.catch(this.errorLogger.logErrorHandler('failed to open contact selector'));
	}

	private emitOrder(): void {
		this.orderChange.emit(this.order);
	}

	remove(counterparty: IOrderCounterparty): void {
		if (!this.team?.id) {
			throw new Error('team is required');
		}
		if (!this.order?.id) {
			throw new Error('team is required');
		}
		const request: IDeleteCounterpartyRequest = {
			teamID: this.team.id,
			orderID: this.order.id,
			role: counterparty.role,
			contactID: counterparty.contactID,
		};
		this.deleting.push(counterparty);
		this.ordersService.deleteCounterparty(request)
			.subscribe({
				next: () => {
					console.log('deleted counterparty');
				},
				error: this.errorLogger.logErrorHandler('failed to delete counterparty'),
			});
	}

}
