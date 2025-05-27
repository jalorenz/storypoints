describe("Room info", () => {
    it("should be able to read the room link", () => {
        cy.visit("/")
        cy.get('[test-id="create-new-room-button"]').click()

        const baseUrl = "http://example.com"
        cy.url().then((url) => {
            const roomId = url.split('id=')[1]
            cy.get('[test-id="room-info-link"]').should('have.text', `${baseUrl}/room?id=${roomId}`)
        })
    })
})