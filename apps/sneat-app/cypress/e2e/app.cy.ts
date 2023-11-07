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

describe('sneat-app', () => {
	// beforeEach(async () => clearAuth());
	beforeEach(() => {
		cy.init();
		cy.login('test@gmail.com', 'password');
		cy.visit('http://localhost:4200');
	});

	it('should display welcome message', () => {
		cy.get('sneat-auth-menu-item').click();
		cy.get('input[type="email"]').type('test@gmail.com');
		cy.get('input[name="first_name"]').type('Test');
		cy.get('input[name="last_name"]').type('Name');
		cy.get('ion-button ion-label:contains(Sign up)').click();
	});
});
