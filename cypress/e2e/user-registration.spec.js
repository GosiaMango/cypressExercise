describe('Account registration', () => {
  let userDetails

  beforeEach(() => {
    cy.fixture('user-registration-details').then((user) => {
      userDetails = user
    })
    cy.visit('/signup')
  })

  it('Valid data account registration', () =>{
    // Fill in first sign up page
    cy.getByDataQa('signup-name').clear().type(userDetails.username)
    cy.getByDataQa('signup-email').clear().type(userDetails.email)
    cy.getByDataQa('signup-button').click()

    // Make sure the full form has proper data in    
    cy.getByDataQa('name').should('have.value', userDetails.username)
    cy.getByDataQa('email').should('have.value', userDetails.email)

    // Fiill in the rest of the form
    cy.getByDataQa('password').clear().type(userDetails.password)   
    cy.getByDataQa('first_name').clear().type(userDetails.firstName)
    cy.getByDataQa('last_name').clear().type(userDetails.lastName)
    cy.getByDataQa('address').clear().type(userDetails.address)
    cy.getByDataQa('country').select(userDetails.country)
    cy.getByDataQa('state').clear().type(userDetails.state)
    cy.getByDataQa('city').clear().type(userDetails.city)
    cy.getByDataQa('zipcode').clear().type(userDetails.zipcode)
    cy.getByDataQa('mobile_number').clear().type(userDetails.mobileNumber)
    cy.getByDataQa('create-account').click()

    // Account created page validation
    cy.getByDataQa('account-created').children().should('have.text', 'Account Created!') 
    cy.getByDataQa('continue-button').click() 

    // Validate that after account creation user is logged in
    cy.get(':nth-child(10) > a').should('contain', `Logged in as ${userDetails.username}`)

    // Delete account and validation
    // Normally would never delete the test data at the end of the test. I would use deleteAccount
    // API call in beforeEach to make sure test has a clean state every time it runs
    // provided DELETE api endpoint didn't work so couldn't use it here
    cy.get('a[href="/delete_account"]').click()
    cy.getByDataQa('account-deleted').children().should('have.text', 'Account Deleted!') 
  })
})
