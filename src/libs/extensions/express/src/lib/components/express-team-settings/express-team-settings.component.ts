import { Component, Inject, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonInput, NavController } from '@ionic/angular';
import { createSetFocusToInput } from '@sneat/components';
import { excludeUndefined } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';
import { ExpressTeamService, ISetExpressTeamSettingsRequest } from '../..';

@Component({
	selector: 'sneat-express-team-settings',
	templateUrl: './express-team-settings.component.html',
})
export class ExpressTeamSettingsComponent {
	@ViewChild('addressInput', { static: false }) addressInput?: IonInput;

	@Input() team?: ITeamContext;

	readonly countryID = new FormControl<string>('', {
		validators: [
			Validators.required,
			Validators.minLength(2),
			Validators.maxLength(2)],
	});
	readonly vatNumber = new FormControl<string>('', {
		validators: [
			Validators.minLength(5),
			Validators.maxLength(20)],
	});
	readonly orderNumberPrefix = new FormControl<string>('', {
		validators: [
			Validators.maxLength(5)],
	});
	readonly address = new FormControl<string>('', {
		validators: [
			Validators.required,
			Validators.minLength(10),
			Validators.maxLength(1024)],
	});
	form = new FormGroup({
		countryID: this.countryID,
		address: this.address,
		vatNumber: this.vatNumber,
		orderNumberPrefix: this.orderNumberPrefix,
	});

	public readonly setFocusToInput = createSetFocusToInput(this.errorLogger);

	isSubmitting = false;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly expressTeamService: ExpressTeamService,
		private readonly navController: NavController,
	) {
	}

	onCountryChanged(countryID: string): void {
		this.countryID.setValue(countryID);
		setTimeout(() => this.setFocusToInput(this.addressInput), 100);
	}


	submit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			alert('Please fill in all required fields.');
			return;
		}
		if (!this.team) {
			this.errorLogger.logError('No team context provided.');
			return;
		}
		const request: ISetExpressTeamSettingsRequest = excludeUndefined({
			teamID: this.team.id,
			address: {
				countryID: this.countryID.value || '',
				lines: this.address.value?.trim().split('\n') || [],
			},
			vatNumber: this.vatNumber.value?.trim() || undefined,
			orderNumberPrefix: this.orderNumberPrefix.value || undefined,
		});
		this.isSubmitting = true;
		this.expressTeamService.setExpressTeamSettings(request).subscribe({
			next: () => {
				console.log('success');
			},
			error: err => {
				this.errorLogger.logError(err, 'Failed to set express team settings.');
				this.isSubmitting = false;
			},
		});
	}
}
