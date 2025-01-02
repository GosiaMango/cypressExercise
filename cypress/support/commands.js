Cypress.Commands.add('getByDataQa', (selector) => {
    return cy.get(`[data-qa=${selector}]`)
})

Cypress.Commands.add('frontendLogin', (user) => {
    cy.visit('/login')

    cy.getByDataQa('login-email').clear().type(user.email)
    cy.getByDataQa('login-password').clear().type(user.password)
    cy.getByDataQa('login-button').click()

    cy.get(':nth-child(10) > a').should('contain', `Logged in as ${user.username}`)
})


Cypress.Commands.add('deleteAccount', () => {

    cy.get('a[href="/delete_account"]').click()
    cy.get('[data-qa=account-deleted] > b').should('have.text', 'Account Deleted!')
})
