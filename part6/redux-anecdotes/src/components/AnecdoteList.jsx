import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(({anecdotes, filter}) => {

    const filtered = anecdotes.filter(e =>
      e.content.toLowerCase().includes(filter.toLowerCase())
    )
    return [...filtered].sort((a,b) => b.votes - a.votes)
  })

  const dispatch = useDispatch()
  const vote = (content, id) => {
    dispatch(setNotification(`you voted '${content}'`), 10)
    dispatch(voteAnecdote(id))
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.content, anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList

