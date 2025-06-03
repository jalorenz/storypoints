const io = require("socket.io-client")

describe("Room with others", () => {
    it("should see that an user joins the room", () => {
        cy.visit("/")
        cy.get('[test-id="create-new-room-button"]').click()
        cy.get('[test-id^="room-user-"]').should('have.length', 1)

        cy.url().then((url) => {
            const roomId = url.split('id=')[1]
            cy.task("connectAsOtherUser", roomId)
            cy.get('[test-id^="room-user-"]').should('have.length', 2)
        })
    })

    it("should see that an user leaves the room", () => {
        cy.visit("/")
        cy.get('[test-id="create-new-room-button"]').click()
        cy.get('[test-id^="room-user-"]').should('have.length', 1)

        cy.url().then((url) => {
            const roomId = url.split('id=')[1]
            cy.task("connectAsOtherUser", roomId)
            cy.get('[test-id^="room-user-"]').should('have.length', 2)

            cy.task("leave")
            cy.get('[test-id^="room-user-"]').should('have.length', 1)
        })
    })
})
