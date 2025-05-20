describe("Room info", () => {
    it("should be able to read the room link", () => {
        cy.visit("/")
        cy.get('[test-id="create-new-room-button"]').click()

        cy.url().then((url) => {
            const roomId = url.split('id=')[1]
            cy.get('[test-id="room-info-link"]').should('have.text', `${Cypress.config().baseUrl}/room?id=${roomId}`)
        })
    })
})