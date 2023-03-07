import { AfterViewInit, Component, Inject, Input, ViewChild } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { createSetFocusToInput, ISelectItem } from '@sneat/components';
import {
	ContainerType,
	LogistOrderService,
	IAddContainersRequest,
	ILogistOrderContext,
} from '../..';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-new-container',
	templateUrl: './new-container.component.html',
})
export class NewContainerComponent implements AfterViewInit {

	@Input() order?: ILogistOrderContext;
	@Input() team?: ITeamContext;

	@ViewChild('containerNumberInput', { static: false }) containerNumberInput?: IonInput;

	selectedShippingPointIDs?: ReadonlyArray<string>;

	readonly containerTypes: ISelectItem[] = [
		{ id: '8ft', title: '8 ft.' },
		{ id: '10ft', title: '10 ft.' },
		{ id: '20ft', title: '20 ft.' },
		{ id: '20ftHighCube', title: '20 ft. High Cube' },
		{ id: '40ft', title: '40 ft.' },
		{ id: '40ftHighCube', title: '40 ft. High Cube' },
	];

	containerType?: string;
	containerNumber = '';
	grossWeightKg?: number;
	isSubmitting = false;

	public readonly setFocusToInput = createSetFocusToInput(this.errorLogger);

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modalController: ModalController,
		private readonly orderService: LogistOrderService,
	) {
	}

	ngAfterViewInit(): void {
		this.selectedShippingPointIDs = this.order?.dto?.shippingPoints?.map(p => p.id);
	}

	onContainerTypeChanged(): void {
		setTimeout(() => this.setFocusToInput(this.containerNumberInput), 100);
	}

	close(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		this.modalController.dismiss().catch(console.error);
	}

	addContainer(event: Event): void {
		if (!this.order) {
			return;
		}
		if (!this.team?.id) {
			this.errorLogger.logError('No team id provided');
			return;
		}
		if (!this.containerType) {
			alert('container type must be selected');
			return;
		}
		if (this.containerNumber?.trim() && this?.order?.dto?.containers?.some(c => c.number === this.containerNumber.trim())) {
			alert('There is already container with the same number added to the order.');
			return;
		}
		if (this.order.id) {
			this.isSubmitting = true;
			const request: IAddContainersRequest = {
				orderID: this.order.id,
				teamID: this.team.id,
				containers: [
					{
						type: this.containerType as ContainerType,
						number: this.containerNumber,
						shippingPointIDs: this.selectedShippingPointIDs,
					},
				],
			};
			this.orderService.addContainers(request).subscribe({
				next: () => this.close(event),
				error: err => {
					this.errorLogger.logError(err);
					setTimeout(() => this.isSubmitting = false, 1000);
				},
			});
		} else {
			this.errorLogger.logError('Not implemented yet');
			return;
		}
	}

}