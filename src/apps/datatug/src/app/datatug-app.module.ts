import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicModule} from '@ionic/angular';
import {DatatugAppComponent} from './datatug-app.component';
import {DatatugAppRoutingModule} from './datatug-app-routing.module';
import {CoreModule} from '@sneat/core';
import {SneatAppModule} from '@sneat/app';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {CommonModule} from "@angular/common";
import {WormholeModule} from "@sneat/wormhole";
import {HelloWorldPageComponent} from "./hello-world-page.component";

@NgModule({
	declarations: [
		DatatugAppComponent,
		HelloWorldPageComponent,
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
		AngularFireModule.initializeApp(environment.firebaseConfig),
		// AngularFireAnalyticsModule,
		// AngularFireAuthModule,
		// AngularFirestoreModule,
		CommonModule,
		CoreModule,
		WormholeModule, // WormholeModule have to be imported at root module
		SneatAppModule,
		DatatugAppRoutingModule,
		// DatatugMenuModule,
	],
	providers: [
		// StatusBar,
		// SplashScreen,
		// AngularFireAuth,
		// AngularFireAuthGuard,
		// SneatAuthGuard,
	],
	bootstrap: [
		DatatugAppComponent,
	],
})
export class DatatugAppModule {
	constructor() {
		console.log('DatatugAppModule.constructor()');
	}
}
