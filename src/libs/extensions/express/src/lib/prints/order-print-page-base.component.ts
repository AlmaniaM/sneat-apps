import { Directive } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { IExpressOrderContext, IOrderCounterparty } from '../dto';
import { ExpressOrderService } from '../services';

import { OrderPageBaseComponent } from '../pages/order-page-base.component';

@Directive() // we need this decorator so we can implement Angular interfaces
export class OrderPrintPageBaseComponent extends OrderPageBaseComponent {

	protected consignee?: IOrderCounterparty;
	protected carrier?: IOrderCounterparty;

	constructor(
		className: string,
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		orderService: ExpressOrderService,
	) {
		super(className, route, teamParams, orderService);
	}

	protected override onOrderChanged(order: IExpressOrderContext): void {
		super.onOrderChanged(order);
		console.log('OrderShippingDocComponent.onOrderChanged()', order);
		this.consignee = order.dto?.counterparties?.find(c => c.role === 'consignee');
		this.carrier = order.dto?.counterparties?.find(c => c.role === 'carrier');
	}
}
