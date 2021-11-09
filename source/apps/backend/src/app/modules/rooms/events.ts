/*
  Describes event that are received by client sockets.
 */
export enum IncomingRoomEvents {
  createRoom = "createRoom",
  joinRoom = "joinRoom",
  vote = "vote"
}

/*
  Describes events that are sent to client sockets.
 */
export enum OutgoingRoomEvents {
  memberJoined = "memberJoined",
  memberLeaved = "memberLeaved",
  memberVoted = "memberVoted",
  revealVotes = "revealVotes",
}
