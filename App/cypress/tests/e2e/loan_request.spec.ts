describe('Loan Request Component', () => {
  beforeEach(() => {
    cy.loginAsEmployee();
    cy.visit('/loan-request');
  });

  it('should load the loan request form correctly', () => {
    cy.get('h2').should('contain', 'Loan Request');
    cy.get('form').should('exist');
    cy.get('#type').should('exist');
    cy.get('#amount').should('exist');
    cy.get('#currencyCode').should('exist');
    cy.get('[type="submit"]').should('be.disabled');
  });

  it('should validate required fields', () => {
    cy.get('[type="submit"]').click();

    // Check validation messages
    cy.get('#type + .error').should('contain', 'You must select a loan type');
    cy.get('#amount.ng-invalid').should('exist');
    cy.get('#currencyCode + .error').should('contain', 'You must select a currency');
    cy.get('#monthlyIncome.ng-invalid').should('exist');
    cy.get('#employmentStatus + .error').should('contain', 'You must select employment status');
    cy.get('#employmentDuration.ng-invalid').should('exist');
    cy.get('#repaymentPeriod + .error').should('contain', 'Repayment period is required');
    cy.get('#contactPhone.ng-invalid').should('exist');
    cy.get('#rate-type + .error').should('contain', 'You must select a interest rate type');
    cy.get('#accountNumber + .error').should('contain', 'You must select a bank account');
    cy.get('#purpose.ng-invalid').should('exist');
  });

  describe('Personal Loan Request', () => {
    beforeEach(() => {
      // Fill out the form
      cy.get('#type').select('PERSONAL');
      cy.get('#amount').type('5000');
      cy.get('#currencyCode').select('USD');
      cy.get('#monthlyIncome').type('3000');
      cy.get('#employmentStatus').select('EMPLOYED');
      cy.get('#employmentDuration').type('24');
      cy.get('#repaymentPeriod').select('24');
      cy.get('#contactPhone').type('+381641234567');
      cy.get('#rate-type').select('FIXED');
      cy.get('#accountNumber').select('1234567890');
      cy.get('#purpose').type('Home renovation');
    });

    it('should enable submit button when all required fields are valid', () => {
      cy.get('[type="submit"]').should('not.be.disabled');
    });

    it('should successfully submit a personal loan request', () => {
      cy.get('[type="submit"]').click();
      cy.wait('@submitLoanRequest').then((interception) => {
        expect(interception.response?.statusCode).to.eq(201);
        expect(interception.request.body).to.deep.equal({
          type: 'PERSONAL',
          amount: 5000,
          currencyCode: 'USD',
          monthlyIncome: 3000,
          employmentStatus: 'EMPLOYED',
          employmentDuration: 24,
          repaymentPeriod: 24,
          contactPhone: '+381641234567',
          interestRateType: 'FIXED',
          accountNumber: '1234567890',
          purpose: 'Home renovation'
        });
      });
      // Verify success state
      cy.get('form').should('not.exist');
      cy.contains('Your loan request has been successfully submitted!').should('exist');
    });

    it('should validate currency matching between loan and account', () => {
      // Change currency to mismatch with selected account
      cy.get('#currencyCode').select('EUR');
      cy.get('#accountNumber + .error').should('contain', 'The selected account currency must match the loan currency');
      cy.get('[type="submit"]').should('be.disabled');
    });
  });

  describe('Mortgage Loan Request', () => {
    beforeEach(() => {
      cy.get('#type').select('MORTGAGE');
      cy.get('#amount').type('200000');
      cy.get('#currencyCode').select('USD');
      cy.get('#monthlyIncome').type('5000');
      cy.get('#employmentStatus').select('EMPLOYED');
      cy.get('#employmentDuration').type('60');
      cy.get('#repaymentPeriod').select('240');
      cy.get('#contactPhone').type('+381641234567');
      cy.get('#rate-type').select('FIXED');
      cy.get('#accountNumber').select('1234567890');
      cy.get('#purpose').type('Home purchase');
    });

    it('should show appropriate repayment periods for mortgage', () => {
      cy.get('#repaymentPeriod option').should('have.length', 4); // 3 options + disabled default
      cy.get('#repaymentPeriod option:not(:disabled)').should('have.length', 3);
      mockRepaymentOptions.MORTGAGE.forEach(period => {
        cy.get('#repaymentPeriod').contains(`${period} months`);
      });
    });

    it('should submit mortgage loan request', () => {
      cy.get('[type="submit"]').click();
      cy.wait('@submitLoanRequest');
      cy.contains('Your loan request has been successfully submitted!').should('exist');
    });
  });

  describe('Form Field Validation', () => {
    it('should validate minimum loan amount', () => {
      cy.get('#amount').type('500');
      cy.get('#amount').blur();
      cy.get('#amount + .error').should('contain', 'Minimum loan amount is 1000');
    });

    it('should validate phone number format', () => {
      cy.get('#contactPhone').type('invalid-phone');
      cy.get('#contactPhone').blur();
      cy.get('#contactPhone + .error').should('contain', 'Invalid phone number format');
    });

    it('should validate purpose length', () => {
      cy.get('#purpose').type('abc');
      cy.get('#purpose').blur();
      cy.get('#purpose + .error').should('contain', 'Purpose must be between 5 and 255 characters');
    });
  });

  it('should reset validation errors on field blur', () => {
    cy.get('[type="submit"]').click();
    cy.get('#type + .error').should('exist');
    cy.get('#type').select('PERSONAL');
    cy.get('#type').blur();
    cy.get('#type + .error').should('not.exist');
  });

  it('should cancel and navigate away', () => {
    cy.get('app-button[type="back-button"]').click();
    cy.url().should('not.include', '/loan-request');
  });
});
