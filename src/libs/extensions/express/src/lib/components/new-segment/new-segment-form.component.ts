import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { excludeEmpty } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext } from '@sneat/team/models';
import { SegmentEndpointType } from './segment-counterparty.component';
import {
	ExpressOrderService, IAddSegmentParty,
	IAddSegmentsRequest,
	IExpressOrderContext,
	IOrderContainer,
	IOrderCounterparty, ISegmentCounterparty,
} from '../..';

@Component({
	selector: 'sneat-new-segment-form',
	templateUrl: './new-segment-form.component.html',
})
export class NewSegmentFormComponent implements OnInit {
	@Input() order?: IExpressOrderContext;
	@Input() container?: IOrderContainer;
	@Input() isInModal?: boolean;

	@Output() readonly created = new EventEmitter<void>();
	@Output() readonly canceled = new EventEmitter<void>();

	byContact?: IContactContext;
	fromContact?: IContactContext = {
		id: '',
		team: { id: '' },
		brief: { id: '', type: 'company', title: '', roles: ['port'] },
	};
	toContact?: IContactContext;

	readonly = false;

	from: 'port' | 'dispatcher' = 'port';
	to: 'port' | 'dispatcher' = 'dispatcher';

	fromDate = '';
	toDate = '';

	fromRefNumber = '';
	toRefNumber = '';
	byRefNumber = '';

	selectedContainerIDs: string[] = [];


	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: ExpressOrderService,
	) {
	}

	onByRefNumberChanged(refNumber: string): void {
		this.byRefNumber = refNumber;
	}

	onEndpointTypeChanged(what: 'from' | 'to', endpointType: SegmentEndpointType): void {
		console.log('NewSegmentComponent.onEndpointTypeChanged()', what, endpointType);
		switch (what) {
			case 'from':
				if (this.from === 'port' && this.to === 'port') {
					this.to = 'dispatcher';
				}
				this.fromContact = undefined;
				break;
			case 'to':
				if (this.to === 'port' && this.from === 'port') {
					this.from = 'dispatcher';
				}
				this.toContact = undefined;
				break;
			default:
				throw new Error(`Unknown endpoint type: ${endpointType}`);
		}
	}

	onByContactChanged(contact: IContactContext): void {
		console.log('NewSegmentComponent.onByContactChanged()',contact);
		if (this.byContact && this.byRefNumber) {
			this.byRefNumber = '';
		}
		this.byContact = contact;
	}

	ngOnInit(): void {
		console.log('NewSegmentComponent.ngOnInit()', this.order);
		if (!this.order) {
			return;
		}
		// this.containerIDs = this.order?.dto?.containers?.map(c => c.id) || [];
		const fromPorts = this.order?.dto?.counterparties?.filter(c => c.role === 'port_from');
		if (fromPorts?.length == 1) {
			const fromPort = fromPorts[0];
			this.fromContact = {
				id: fromPort.contactID,
				team: this.order.team,
				brief: {
					id: fromPort.contactID,
					type: 'company',
					countryID: fromPort.countryID,
					title: fromPort.title,
					roles: ['port'],
				},
			};
		}
		console.log('fromContact', this.fromContact);
	}

	submitAddSegment(event: Event): void {
		console.log('submitAddSegment', event);
		if (!this.order?.id) {
			alert('order is required');
			return;
		}
		if (!this.order.team) {
			alert('team is required');
			return;
		}
		if (!this.byContact && !confirm('Do you want to add a segment without a carrier?')) {
			return;
		}
		if (!this.fromContact) {
			alert('from contact is required');
			return;
		}
		if (!this.toContact) {
			alert('to contact is required');
			return;
		}
		if (!this.selectedContainerIDs?.length) {
			alert('containers are required to be selected');
			return;
		}
		let by: IAddSegmentParty | undefined = undefined;

		if (this.byContact?.brief) {
			by = {
				counterparty: {
					contactID: this.byContact.id,
					role: 'trucker',
				},
				refNumber: this.byRefNumber,
			};
		}

		const request: IAddSegmentsRequest = excludeEmpty({
			orderID: this.order.id,
			teamID: this.order.team?.id,
			containers: this.selectedContainerIDs.map(id => ({ id })),
			from: excludeEmpty({
				counterparty: {
					contactID: this.fromContact.id,
					role: this.from === 'port' ? 'port_from' : 'dispatch-point',
				},
				date: this.fromDate,
				refNumber: this.fromRefNumber,
			}),
			to: excludeEmpty({
				counterparty: {
					contactID: this.toContact.id,
					role: this.to === 'port' ? 'port_to' : 'dispatch-point',
				},
				date: this.toDate,
				refNumber: this.toRefNumber,
			}),
			by,
		});
		this.orderService
			.addSegments(request)
			.subscribe({
				next: () => this.created.emit(),
				error: this.errorLogger.logErrorHandler('Failed to add segments'),
			});
	}

	// protected switchFromWithTo(): void {
	// 	const from = this.from, to = this.to;
	// 	const fromContact = this.fromContact, toContact = this.toContact;
	// 	const fromDate = this.fromDate, toDate = this.toDate;
	// 	this.from = to;
	// 	this.to = from;
	// 	setTimeout(() => {
	// 		this.fromContact = toContact;
	// 		this.toContact = fromContact;
	// 		this.fromDate = toDate;
	// 		this.toDate = fromDate;
	// 	}, 10);
	// }

}