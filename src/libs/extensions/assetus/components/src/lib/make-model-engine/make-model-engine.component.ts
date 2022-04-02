//tslint:disable:no-unsafe-any
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {carMakes} from 'sneat-shared/models/data/vehicles';

@Component({
	selector: 'app-make-model-engine',
	templateUrl: './make-model-engine.component.html',
})
export class MakeModelEngineComponent {

	@Input() mode: 'new' | 'view' | 'edit';

	@Input() regNumber: string;
	makeVal: string;
	modelVal: string | undefined;

	makes: string[];
	models: string[] | undefined;


	@Input() set make(v: string) {
		this.makeVal = v;
		this.makes = Object.keys(carMakes);
		this.populateModels();
	}

	@Input() set model(v: string) {
		this.modelVal = v;
	}

	@Input() engine: string;

	yearBuildNumber: number;
	yearBuildVal: string;

	@Input() set yearBuild(v: number) {
		this.yearBuildNumber = v;
		this.yearBuildVal = v.toString();
	}

	// tslint:disable-next-line:no-any
	@Output() changed = new EventEmitter<{ field: string; value: any }>();

	// tslint:disable-next-line:prefer-function-over-method
	editRegNumber(): void {
		alert('Editing registration number is not implemented yet');
	}

	// tslint:disable-next-line:prefer-function-over-method
	editMakeModel(event?: Event): void {
		if (event) {
			event.stopPropagation();
		}
		alert('Editing make&model is not implemented yet');
	}

	private populateModels(): void {
		if (!this.makeVal) {
			this.models = undefined;
			this.modelVal = undefined;
			return;
		}
		const make = carMakes[this.makeVal];
		this.models = make.models.map(v => v.model);
		if (this.modelVal && this.models.indexOf(this.modelVal) <= 0) {
			this.modelVal = undefined;
		}
	}

	makeChanged(): void {
		this.changed.emit({field: 'make', value: this.makeVal});
		this.populateModels();
	}

	modelChanged(): void {
		this.changed.emit({field: 'model', value: this.makeVal});
	}

	yearChanged(): void {
		this.yearBuildNumber = new Date(this.yearBuildVal).getFullYear();
		this.changed.emit({field: 'yearBuild', value: this.yearBuildVal});
	}
}