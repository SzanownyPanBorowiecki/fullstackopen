import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'

import {
  getAnecdotes,
  createAnecdote,
  updateAnecdote
} from './requests'

import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

import { useNotificationDispatch } from './AnecdotesContext'

const App = () => {
  const notificationDispatch = useNotificationDispatch()

  const queryClient = useQueryClient()

  const createAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const data = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], data.concat(newAnecdote))

      notificationDispatch({
        type: 'SET',
        payload: `anecdote '${newAnecdote.content}' created`
      })
      setTimeout(() => notificationDispatch({ type: 'CLEAR' }), 5000)
    },
    onError: (error) => {
      const message = `error: ${error.response?.data?.error
        ? error.response.data.error
        : error.message}`

      notificationDispatch({
        type: 'SET',
        payload: message
      })
      setTimeout(() => notificationDispatch({ type: 'CLEAR' }), 5000)
    }
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const data = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(
        ['anecdotes'],
        data.map(e =>
          e.id !== updatedAnecdote.id ? e : updatedAnecdote)
        )

      notificationDispatch({
        type: 'SET',
        payload: `anecdote '${updatedAnecdote.content}' voted`
      })
      setTimeout(() => notificationDispatch({ type: 'CLEAR' }), 5000)
    }
  })

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false
  })

  if ( result.isLoading ) {
    return <div>Loading...</div>
  }

  if ( result.isError ) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  const handleCreate = (content) => {
    createAnecdoteMutation.mutate({content, votes: 0})
  }

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
  }

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <AnecdoteForm handleCreate={handleCreate}/>
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
