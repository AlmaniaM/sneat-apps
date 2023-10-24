import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SneatCardListComponent } from '@sneat/components';
import { ContactusServicesModule } from '@sneat/contactus-services';
import { MembersListComponent } from '@sneat/contactus-shared';
import { InviteLinksComponent } from '@sneat/team-components';
import { MembersComponent } from '../members/members.component';
import { MetricsComponent } from '../metrics/metrics.component';
import { RetrospectivesComponent } from '../retrospectives/retrospectives.component';
import { ScrumsComponent } from '../scrums/scrums.component';
import { TeamPageRoutingModule } from './team-page-routing.module';
import { TeamPageComponent } from './team-page.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		TeamPageRoutingModule,
		InviteLinksComponent,
		SneatCardListComponent,
		MembersListComponent,
		ContactusServicesModule,
	],
	declarations: [
		MembersComponent,
		MetricsComponent,
		RetrospectivesComponent,
		ScrumsComponent,
		TeamPageComponent,
	],
})
export class TeamPageModule {}
