// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
import {
	getAuth,
	connectAuthEmulator,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import { FirebaseOptions, getApp, initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from '@firebase/firestore';

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => {
// 	console.log('Custom command example: Login', email, password);
// });

//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (email, password) => {
	signInWithEmailAndPassword(getAuth(getApp()), email, password).then(() => {
		console.log('Logged in as:', email);
	});
});

Cypress.Commands.add('init', () => {
	const firebaseConfig = {
		useEmulators: true,
		emulator: {
			authPort: 9099,
			firestorePort: 8080,
		},
		apiKey: 'emulator-does-not-need-api-key',
		authDomain: 'sneat.app',
		projectId: 'demo-local-sneat-app',
		appId: '1:5233273170:web:61e8d4f12d03a07e',
		measurementId: 'G-CMCYD6HVGN',
		nickname: 'Sneat.app',
		messagingSenderId: 5233273170,
	};
	const fbApp = initializeApp(firebaseConfig as unknown as FirebaseOptions);
	const host = '127.0.0.1';

	const firestore = getFirestore(fbApp);
	const { emulator } = firebaseConfig;
	if (firebaseConfig.useEmulators && emulator?.firestorePort) {
		console.log(
			`using firebase firestore emulator on ${host}:${emulator.authPort}`,
		);
		connectFirestoreEmulator(firestore, host, emulator.firestorePort);
	}

	const auth = getAuth(fbApp);
	// initializeAuth(fbApp, {
	//   persistence: browserSessionPersistence,
	//   popupRedirectResolver: browserPopupRedirectResolver,
	// });

	connectAuthEmulator(
		auth,
		`http://${host}:${firebaseConfig.emulator.authPort}`,
	);
	sessionStorage.clear();
});
