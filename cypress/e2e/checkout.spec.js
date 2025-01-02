describe('Checkout process registered user', () => {
    let userDetails;

    before(() => {
        // Plan was to register user account via provided API endpoint.
        // As it didn't work had to do the set-up via UI or use the user from user-registration test
        // Both very bad practice I was never forced to use up till now
        cy.fixture('user-registration-details').then((user) => {
            userDetails = user;

            cy.visit('/signup');
            cy.getByDataQa('signup-name').clear().type(userDetails.username);
            cy.getByDataQa('signup-email').clear().type(userDetails.email);
            cy.getByDataQa('signup-button').click();

            // Fiill in the rest of the form
            cy.getByDataQa('password').clear().type(userDetails.password);
            cy.getByDataQa('first_name').clear().type(userDetails.firstName);
            cy.getByDataQa('last_name').clear().type(userDetails.lastName);
            cy.getByDataQa('address').clear().type(userDetails.address);
            cy.getByDataQa('country').select(userDetails.country);
            cy.getByDataQa('state').clear().type(userDetails.state);
            cy.getByDataQa('city').clear().type(userDetails.city);
            cy.getByDataQa('zipcode').clear().type(userDetails.zipcode);
            cy.getByDataQa('mobile_number').clear().type(userDetails.mobileNumber);
            cy.getByDataQa('create-account').click();

            // Account created page validation
            cy.getByDataQa('account-created')
                .children()
                .should('have.text', 'Account Created!');
            cy.getByDataQa('continue-button').click();

            cy.get('a[href="/logout"]').click();
        });
    });

    beforeEach(() => {
        cy.frontendLogin(userDetails);
    });

    it('Add item to chart', () => {
        cy.visit('/products');

        cy.get('[data-product-id=1]').first().as('product').click();
        cy.get('.modal-body > :nth-child(1)').should(
            'have.text',
            'Your product has been added to cart.'
        );
        cy.get('.modal-body > :nth-child(2)')
            .should('have.text', 'View Cart')
            .click();

        // Confirm 1 product added
        cy.get('[id=cart_info_table]').find('tbody').should('have.length', 1);
        cy.get('.cart_quantity').find('button').should('have.text', 1);
    });

    // In real life scenario wouldn't use dependency between the tests. Each stage of checkout would be preceeded by relevant data-seeding to be able to
    // test only one functionality at once not the whole chain that is very likely to fail somewhere in the middle not even reaching to the final checkout stage
    it('Proceed to checkout, review order details and place the order', () => {
        cy.visit('/view_cart');

        cy.contains('.check_out', 'Proceed To Checkout').click();

        // validate delivery address and billing address are displayed
        cy.get('#address_delivery').should('be.visible');
        cy.get('#address_invoice').should('be.visible');

        // validate delivery address
        cy.get('[id = address_delivery]')
            .children()
            .should('contain', userDetails.firstName + " " + userDetails.lastName)
            .and('contain', userDetails.address)
            .and('contain', userDetails.city + " " + userDetails.state);

        // TODO validate the item is in the order and total price is there

        cy.contains('.btn', 'Place Order').click();
    });

    it('Pay and get confirmation', () => {
        cy.visit('/payment');

        cy.getByDataQa('name-on-card')
            .clear()
            .type(userDetails.firstName + " " + userDetails.lastName);

        cy.getByDataQa('card-number').clear().type(userDetails.cardNumber);
        cy.getByDataQa('cvc').clear().type(userDetails.cvc);
        cy.getByDataQa('expiry-month').clear().type(userDetails.expiryMonth);
        cy.getByDataQa('expiry-year').clear().type(userDetails.expiryYear);

        cy.getByDataQa('pay-button').click();

        cy.get('[data-qa=order-placed] + p').should(
            'have.text',
            'Congratulations! Your order has been confirmed!'
        );

        cy.getByDataQa('continue-button').click();
        // TODO validate main page displayed
    });

    after(() => {
        // Delete account and validation
        // Normally would never delete the test data at the end of the test. I would use deleteAccount
        // API call in beforeEach to make sure test has a clean state every time it runs
        // However, provided DELETE api endpoint didn't work so couldn't use it here
        cy.deleteAccount();
    });
});
