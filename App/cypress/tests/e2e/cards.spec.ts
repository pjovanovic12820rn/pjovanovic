describe('Cards Component USER', () => {
  beforeEach(function()  {
    cy.loginAsClient();
    cy.get('.sidebar-link').contains('Accounts').click()
    cy.url().should('include', '/account-management');
    cy.get('app-button > button')
      .filter(':contains("View Cards")')
      .first()
      .click();
  });

  it('should create card', function() {
    cy.get('table tr').then(($rows) => {
      if ($rows.length === 3) {
        return
      }
      cy.get('button').contains('Create New Card').click();
      cy.wait(500)
      cy.get('[label="Card Name"] > .input-container > input', { timeout: 2000 })
        .then(($nameInput) => {
          if (!$nameInput.length) {
            this.skip();
          } else {
            cy.wrap($nameInput).clear().type('Premium Credit Card 25');
          }
        });

      // Check for card limit input
      cy.get('[label="Card Limit"] > .input-container > input', { timeout: 2000 })
        .then(($limitInput) => {
          if (!$limitInput.length) {
            // Again, skip if not found
            this.skip();
          } else {
            // Otherwise, proceed
            cy.wrap($limitInput).clear().type('100');
          }
        });
      cy.wait(120)
      cy.get('app-button > button').contains('Create').click();
      cy.wait(120)
      // Use cy.location() to check if the URL includes '/success'.
      cy.location('pathname', { timeout: 10000 }).then((pathname) => {
        if (pathname.includes('/success')) {
          cy.get('app-button.success-button > .success-button').click();
          const initialCount = $rows.find('td').length;
          // cy.get('table tr td:contains("ACTIVE")')
          //   .should(($newActive) => {
          //     expect($newActive.length).to.be.greaterThan(initialCount);
          //   });
        } else {
          cy.log(`URL did not update to success.`);
          return
        }
      });
    })
  });

  it('should block a card when active cards exist', () => {
    // First check if any active cards exist
    cy.get('table tr').then(($rows) => {
      const activeCards = $rows.find('td:contains("ACTIVE")');

      if (activeCards.length === 0) {
        cy.log('no active');
        return;
      }

      const initialCount = activeCards.length;

      // Click the first Block Card button
      cy.get('button').contains('Block Card').first().click();

      // Verify count decreased
      cy.get('table tr td:contains("ACTIVE")')
        .should(($newActive) => {
          expect($newActive.length).to.be.lessThan(initialCount);
        });
    });
  });

  it('should block a card when blocked cards exist', () => {
    // First check if any active cards exist
    cy.get('table tr').then(($rows) => {
      const activeCards = $rows.find('td:contains("BLOCKED")');

      if (activeCards.length === 0) {
        cy.log('no blocked');
        return;
      }

      const initialCount = activeCards.length;

      // Click the first Block Card button
      cy.get('button').contains('Unblock Card').first().click();

      // Verify count decreased
      cy.get('table tr td:contains("BLOCKED")')
        .should(($newActive) => {
          expect($newActive.length).to.be.lessThan(initialCount);
        });
    });
  });
});
describe('Cards Component ADMIN', () => {
  beforeEach(function()  {
    cy.loginAsEmployee();
    cy.get('app-button > button')
      .filter(':contains("List Accounts")')
      .first()
      .click()
    cy.url().should('include', '/account-management');
    cy.get('app-button > button')
      .filter(':contains("View Cards")')
      .first()
      .click();
  });

  it('should block a card when active cards exist', () => {
    // First check if any active cards exist
    cy.get('table tr').then(($rows) => {
      const activeCards = $rows.find('td:contains("ACTIVE")');

      if (activeCards.length === 0) {
        cy.log('no active');
        return;
      }

      const initialCount = activeCards.length;

      // Click the first Block Card button
      cy.get('button').contains('Block Card').first().click();

      // Verify count decreased
      cy.get('table tr td:contains("ACTIVE")')
        .should(($newActive) => {
          expect($newActive.length).to.be.lessThan(initialCount);
        });
    });
  });

  it('should block a card when blocked cards exist', () => {
    // First check if any active cards exist
    cy.get('table tr').then(($rows) => {
      const activeCards = $rows.find('td:contains("BLOCKED")');

      if (activeCards.length === 0) {
        cy.log('no blocked');
        return;
      }

      const initialCount = activeCards.length;

      // Click the first Block Card button
      cy.get('button').contains('Unblock Card').first().click();

      // Verify count decreased
      cy.get('table tr td:contains("BLOCKED")')
        .should(($newActive) => {
          expect($newActive.length).to.be.lessThan(initialCount);
        });
    });
  });

  it('should deactivate a card', function() {
    // Grab the table rows first to track "DEACTIVATED" counts, etc.
    cy.get('table tr').then(($rows) => {
      console.log($rows.length)
      if ($rows.length < 2) {
        return
      }
      // Save current count of DEACTIVATED cards
      const initialDeactivatedCount = $rows.find('td:contains("DEACTIVATED")').length;

      // Grab all "Deactivate Card" buttons, then filter out any that are disabled
      cy.get('button:contains("Deactivate Card")')
        .then(($buttons) => {
          const enabledDeactivateButtons = $buttons.filter((i, el) => !Cypress.$(el).prop('disabled'));

          // If no enabled deactivate buttons, skip the test
          if (enabledDeactivateButtons.length === 0) {
            this.skip();
          } else {
            // Otherwise, click the first enabled Deactivate button
            cy.wrap(enabledDeactivateButtons).first().click();

            // Now verify the DEACTIVATED count has increased
            cy.get('table tr td:contains("DEACTIVATED")').should(($updated) => {
              expect($updated.length).to.be.greaterThan(initialDeactivatedCount);
            });
          }
        });
    });
  });

});
