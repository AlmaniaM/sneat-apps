import { IEnvironmentConfig, IFirebaseConfig } from "../lib/environment-config";

const useEmulators = true;

const firebaseConfig: IFirebaseConfig = {
	emulator: {
		authPort: 9099,
		firestorePort: 8080,
	},
	apiKey: useEmulators
		? "emulator-does-not-need-api-key"
		: "AIzaSyAYGGhSQQ8gUcyPUcUOFW7tTSYduRD3cuw",
	authDomain: "sneat.team",
	databaseURL: useEmulators ? "http://localhost:8080" : undefined,
	projectId: useEmulators ? "demo-sneat" : "sneat-team",
	// 	storageBucket: 'sneat-team.appspot.com',
	// 	messagingSenderId: '724666284649',
	appId: "1:724666284649:web:080ffaab56bb71e49740f8",
	measurementId: "G-RRM3BNCN0S",
};

export const localEnvironmentConfig: IEnvironmentConfig = {
	production: false,
	useEmulators,
	agents: {},
	firebaseConfig,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import "zone.js/dist/zone-error";  // Included with Angular CLI.