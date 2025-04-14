describe('Welcome Page Test', () => {
  beforeEach(function() {
    cy.visit('/'); // Visit the home page before each test
  });

  it('should have Employee Login and Client Login buttons', () => {
    // Check if the Employee Login button exists
    cy.get('[type="button"]')
      .contains('Employee Login')
      .should('exist')
      .and('contain', 'Employee Login');

    // Check if the Client Login button exists
    cy.get('[type="button"]')
      .contains('User Login')
      .should('exist')
  });

  it('should navigate to /employee/login when Employee Login is clicked', () => {
    // Click the Employee Login button
    cy.get('[type="button"]').contains('Employee Login').click();

    // Verify the URL after clicking
    cy.url().should('include', '/login/employee');
  });

  it('should navigate to /client/login when Client Login is clicked', () => {
    // Click the Client Login button
    cy.get('[type="button"]').contains('User Login').click();

    // Verify the URL after clicking
    cy.url().should('include', '/login/client');
  });
});
