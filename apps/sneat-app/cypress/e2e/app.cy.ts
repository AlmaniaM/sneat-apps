// import { getGreeting } from '../support/app.po';

// const authEmulatorPort = '9099';
// const firebaseProjectId = 'demo-local-sneat-app';
// const clearAuth = async () => {
//   const res = await fetch(`http://127.0.0.1:${authEmulatorPort}/emulator/v1/projects/${firebaseProjectId}/accounts`, {
//     method: 'DELETE',
//     headers: {
//       Authorization: 'Bearer owner',
//     },
//   });

//   if (res.status !== 200) throw new Error('Unable to reset Authentication Emulators');
// }

// describe('sneat-app', () => {
// 	beforeEach(async () => clearAuth());
// 	beforeEach(() => cy.visit('/'));

// 	it('should display welcome message', () => {
// 		cy.get('sneat-auth-menu-item').click();
// 		cy.get('ion-item:contains(Login with Google)').click();

// 		// Custom command example, see `../support/commands.ts` file
// 		cy.login('my-email@something.com', 'myPassword');

// 		// Function helper example, see `../support/app.po.ts` file
// 		getGreeting().contains(/Welcome/);
// 	});
// });

describe('Some Test', () => {
	it('Adds document to test_hello_world collection of Firestore', () => {
		cy.callFirestore('add', 'test_hello_world', { some: 'value' });
		cy.login('am@gmail.com');
	});
});
