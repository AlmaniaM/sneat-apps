import { Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	ExpressOrderService,
	IDeleteCounterpartyRequest,
	IExpressOrderContext,
	IOrderCounterparty,
	IOrderSegment,
	getOrderSegments,
} from '../..';
import { ITeamContext } from '@sneat/team/models';
import { IOrderPrintedDocContext, OrderPrintService } from '../../prints/order-print.service';

@Component({
	selector: 'sneat-order-trucker',
	templateUrl: './order-trucker.component.html',
})
export class OrderTruckerComponent implements OnChanges {
	@Input() team?: ITeamContext;
	@Input() order?: IExpressOrderContext;
	@Input() trucker?: IOrderCounterparty;

	// public segments?: ReadonlyArray<IContainerSegment>;

	public orderSegments?: ReadonlyArray<IOrderSegment>;

	deleting = false;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly ordersService: ExpressOrderService,
		private readonly orderPrintService: OrderPrintService,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('OrderTruckerComponent.ngOnChanges', changes);
		if (changes['order'] || changes['trucker']) {
			const contactID = this.trucker?.contactID;
			this.orderSegments = getOrderSegments(this.order?.dto?.segments?.filter(s => s.by?.contactID === contactID));
		}
	}

	addSegment(): void {
		alert('not implemented yet');
	}

	deleteTrucker(): void {
		if (!this.order || !this.trucker) {
			return;
		}
		const request: IDeleteCounterpartyRequest = {
			teamID: this.order?.team?.id,
			orderID: this.order.id,
			contactID: this.trucker?.contactID,
			role: 'trucker',
		};
		this.deleting = true;
		this.ordersService.deleteCounterparty(request).subscribe({
			next: () => {
				console.log('deleted trucker');
			},
			error: err => {
				this.errorLogger.logError(err, 'Failed to delete trucker');
				this.deleting = false;
			},
		});
	}

	replaceTrucker(): void {
		alert('not implemented yet');
	}

	print(event: Event): void {
		if (!this.order) {
			alert('Can not print without order context');
			return;
		}
		const ctx: IOrderPrintedDocContext = {
			...this.order,
			params: {
				truckerID: this?.trucker?.contactID,
			},
		}
		this.orderPrintService.openOrderPrintedDocument(event, 'trucker-summary', ctx)
	}
}