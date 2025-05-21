describe("Room creation", () => {
    it("should be able to create a room", () => {
        cy.visit("/")

        cy.get('[test-id="create-new-room-button"]').click()

        cy.url().should('include', '/room?id=')
    })
})