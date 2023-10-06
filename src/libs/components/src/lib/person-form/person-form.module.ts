import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '../pipes';
import { AgeGroupFormComponent } from './age-group/age-group-form.component';
import { PersonFormWizardComponent } from './person-form-wizard.component';
import { EmailsFormComponent } from './emails-form/emails-form.component';
import { NamesFormComponent } from './names-form/names-form.component';
import { PetKindInputComponent } from './pet-kind/pet-kind-input.component';
import { PhonesFormComponent } from './phones-form/phones-form.component';
import { GenderFormComponent } from './gender-form/gender-form.component';
import { RelationshipFormComponent } from './relationship-form/relationship-form.component';
import { RolesFormComponent } from './roles-form/roles-form.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		ReactiveFormsModule,
		SneatPipesModule,
		PetKindInputComponent,
		RelationshipFormComponent,
	],
	declarations: [
		PersonFormWizardComponent,
		EmailsFormComponent,
		NamesFormComponent,
		PhonesFormComponent,
		GenderFormComponent,
		AgeGroupFormComponent,
		RolesFormComponent,
	],
	exports: [PersonFormWizardComponent, NamesFormComponent, GenderFormComponent],
})
export class PersonFormModule {
}
