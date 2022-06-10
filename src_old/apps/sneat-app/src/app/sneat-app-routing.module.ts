import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RoutesToCommuneModule } from '@sneat/communes/ui';
import { SneatAuthRoutingModule } from '@sneat/auth-ui';
import { SneatAppMenuComponent } from './sneat-app-menu-component/sneat-app-menu.component';
import { SneatAppMyRoutingModule } from './sneat-app-my-routing.module';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		outlet: 'menu',
		component: SneatAppMenuComponent,
	},
	// {
	// 	path: 'my',
	// 	pathMatch: 'full',
	// 	loadChildren: () =>
	// 		import('./sneat-app-home-page/sneat-app-home-page.component.module').then(m => m.SneatAppHomePageComponentModule),
	// },
	{
		path: '',
		pathMatch: 'full',
		loadChildren: () =>
			import('./pages/sneat-app-home-page/sneat-app-home-page.component.module').then(m => m.SneatAppHomePageComponentModule),
	},
	{
		path: 'my',
		loadChildren: () => import('./sneat-app-my-routing.module').then(m => m.SneatAppMyRoutingModule),
	},
	{
		path: 'space/:teamType/:teamId',
		loadChildren: () =>
			import('@sneat/team/pages').then(m => m.TeamSpaceRoutingModule),
	},
	{
		path: 'join/:teamType',
		loadChildren: () => import('@sneat/team/pages').then(m => m.JoinTeamPageModule)
	},
	// {
	// 	path: 'invite-to/:teamType',
	// 	loadChildren: () => import('@sneat/team/pages').then(m => m.)
	// },
	{
		path: 'communes',
		loadChildren: () =>
			import('@sneat/communes/ui').then(m => m.CommunesRoutingModule),
	},
	{
		path: 'signed-out',
		redirectTo: 'login',
		pathMatch: 'full',
	},
	{
		path: '',
		redirectTo: 'communes',
		pathMatch: 'full',
	},
	{
		path: 'new-family',
		loadChildren: () => import('@sneat/communes/ui').then(m => m.NewCommunePageModule),
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
		SneatAuthRoutingModule,
		RoutesToCommuneModule,
	],
	exports: [RouterModule],
})
export class SneatAppRoutingModule {
}