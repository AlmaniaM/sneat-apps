import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { routingParamProjectId } from '@sneat/datatug-core';

export const datatugStoreRoutes: Routes = [
	{
		path: '',
		loadChildren: () =>
			import('@sneat/datatug/pages/unsorted').then(
				(m) => m.DatatugStorePageModule,
			),
	},
	{
		path: 'diff',
		loadChildren: () =>
			import('@sneat/datatug/pages/unsorted').then((m) => m.DiffPageModule),
	},
	{
		path: 'project/:' + routingParamProjectId,
		loadChildren: () =>
			import('./datatug-routing-proj').then(
				(m) => m.DatatugProjectRoutingModule,
			),
	},
	{
		path: 'project',
		redirectTo: '',
	},
	{
		path: 'environment',
		loadChildren: () =>
			import('@sneat/datatug/pages/unsorted').then(
				(m) => m.EnvironmentPageModule,
			),
	},
];

@NgModule({
	imports: [RouterModule.forChild(datatugStoreRoutes)],
	exports: [RouterModule],
})
export class DatatugStoreRoutingModule {}
