/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/firestore';
import { attachCustomCommands } from 'cypress-firebase';
// import { connectAuthEmulator } from 'firebase/auth';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface Chainable<Subject> {
		login(email: string, password: string): void;
	}
}

// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
	console.log('Custom command example: Login', email, password);
});

//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const fbConfig = {
	apiKey: 'emulator-does-not-need-api-key',
	appId: '1:5233273170:web:61e8d4f12d03a07e',
	projectId: Cypress.env('GCLOUD_PROJECT'),
	authDomain: 'sneat.app',
	useEmulator: true,
	databaseURL: '',
};

// Emulate RTDB if Env variable is passed
const rtdbEmulatorHost = Cypress.env('FIREBASE_DATABASE_EMULATOR_HOST');
if (rtdbEmulatorHost) {
	fbConfig.databaseURL = `http://${rtdbEmulatorHost}?ns=${fbConfig.projectId}`;
}

firebase.initializeApp(fbConfig);

// Emulate Firestore if Env variable is passed
const firestoreEmulatorHost = Cypress.env('FIRESTORE_EMULATOR_HOST');
if (firestoreEmulatorHost) {
	firebase.firestore().settings({
		host: firestoreEmulatorHost,
		ssl: false,
	});
}

const authEmulatorHost = Cypress.env('FIREBASE_AUTH_EMULATOR_HOST');
console.log('Emulator HOST:', authEmulatorHost);
if (authEmulatorHost) {
	firebase.auth().useEmulator(`http://${authEmulatorHost}/`);
	console.debug(`Using Auth emulator: http://${authEmulatorHost}/`);
	// connectAuthEmulator(firebase.auth(), `http://localhost:${authEmulatorHost}`);
}

attachCustomCommands({ Cypress, cy, firebase });
