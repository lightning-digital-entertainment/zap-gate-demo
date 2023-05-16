import React from 'react'
import PostCard from './PostCard'
import useFeed from '../hooks/useFeed'
import { useAppSelector } from '../hooks/useAppSelector'

function Feed() {
  const zgEvents = useAppSelector(state => state.nostr.zgEvents)
  return (
    <div>
      {zgEvents.length > 0 ? zgEvents.map(event => <PostCard event={event} key={event.id}/>) : undefined}
    </div>
  )
}

export default Feed