import { Component, Input } from '@angular/core';
import { ITeamContext } from '@sneat/team/models';
import { ILogistOrderContext } from '../../dto/order-dto';

@Component({
	selector: 'sneat-logist-orders-list',
	templateUrl: './orders-list.component.html',
	styleUrls: ['./orders-list.component.scss'],
})
export class OrdersListComponent {

	@Input() team?: ITeamContext;
	@Input() orders?: ILogistOrderContext[];
}