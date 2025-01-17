import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { routingParamStoreId } from '@sneat/datatug-core';
import { SNEAT_AUTH_GUARDS } from '@sneat/auth-core';

export const datatugRoutes: Routes = [
	{
		path: '',
		loadChildren: () =>
			import('@sneat/datatug/pages/home').then((m) => m.DatatugPagesHomeModule),
	},
	{
		path: 'my',
		...SNEAT_AUTH_GUARDS,
		loadChildren: () =>
			import('@sneat/datatug/pages/my').then((m) => m.DatatugMyPageModule),
	},
	{
		path: 'store/:' + routingParamStoreId,
		loadChildren: () =>
			import('./datatug-routing-store').then(
				(m) => m.DatatugStoreRoutingModule,
			),
		// ...canLoad(),
	},
	{
		path: 'agent',
		redirectTo: '/',
	},
];

@NgModule({
	imports: [RouterModule.forChild(datatugRoutes)],
	exports: [RouterModule],
})
export class DatatugRoutingModule {}
