import { createSlice } from '@reduxjs/toolkit'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: anecdotesAtStart.map(asObject),
  reducers: {
    createAnecdote(state, action) {
      const content = action.payload
      return [...state, asObject(content)]
    },

    voteAnecdote(state, action) {
      const id = action.payload
      return state.map(e =>
        e.id !== id
          ? e
          : {...e, votes: e.votes + 1}
        )
    }
  }
})

export const { createAnecdote, voteAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer

// const initialState = anecdotesAtStart.map(asObject)

// export const voteAnecdote = id => ({
//   type: 'VOTE',
//   payload: { id }
// })

// export const createAnecdote = content => ({
//   type: 'CREATE',
//   payload: { content }
// })

// const reducer = (state = initialState, action) => {
//   console.log('state now: ', state)
//   console.log('action', action)

//   switch (action.type) {
//     case 'CREATE':
//       return [...state, asObject(action.payload.content)]

//     case 'VOTE':
//       return state.map(e =>
//         e.id !== action.payload.id
//           ? e
//           : {...e, votes: e.votes + 1}
//       )

//     default: return state
//   }
// }

// export default reducer
