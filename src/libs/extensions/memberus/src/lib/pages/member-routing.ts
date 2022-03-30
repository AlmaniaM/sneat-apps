import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SneatAuthModule } from '@sneat/auth';
import { TeamMenuComponentModule } from '@sneat/team/components';
// import { guardRoute } from '../../../utils/guard-route';

export const memberRoutes: Route[] = [
	{
		path: 'new-member',
		loadChildren: () => import('./new-member/new-member-page.module')
			.then(m => m.NewMemberPageModule),
		// ...guardRoute,
	},
	// {
	// 	path: 'remove-member',
	// 	loadChildren: () => import('./member/commune-member.module')
	// 		.then(m => m.TeamMemberPageModule),
	// 	...guardRoute,
	// },
];

const routes: Route[] = [
	{
		path: '',
		pathMatch: 'full',
		loadChildren: () => import('./member/team-member-page.module')
			.then(m => m.TeamMemberPageModule),
		// ...guardRoute,
	},
	// {
	// 	path: 'member-assets',
	// 	loadChildren: () => import('./member-assets/member-assets.module')
	// 		.then(m => m.MemberAssetsPageModule),
	// 	...guardRoute,
	// },
	// {
	// 	path: 'member-budget',
	// 	loadChildren: () => import('./member-budget/member-budget.module')
	// 		.then(m => m.MemberBudgetPageModule),
	// 	...guardRoute,
	// },
	// {
	// 	path: 'member-contacts',
	// 	loadChildren: () => import('./member-contacts/member-contacts.module')
	// 		.then(m => m.MemberContactsPageModule),
	// 	...guardRoute,
	// },
	// {
	// 	path: 'member-documents',
	// 	loadChildren: () => import('./member-documents/member-documents.module')
	// 		.then(m => m.MemberDocumentsPageModule),
	// 	...guardRoute,
	//
	// },
	// {
	// 	path: 'member-schedule',
	// 	loadChildren: () => import('../../schedule/schedule/schedule-page.module')
	// 		.then(m => m.SchedulePageModule),
	// 	...guardRoute,
	// },
	// {
	// 	path: 'new-staff',
	// 	loadChildren: () => import('./member-new/member-new.module')
	// 		.then(m => m.MemberNewPageModule),
	// 	...guardRoute,
	// },
];


@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CommonModule,
		IonicModule,
		SneatAuthModule,
		TeamMenuComponentModule,
	],
	exports: [RouterModule],
	declarations: [],
})
export class MemberRoutingModule {
}