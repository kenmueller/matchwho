import type Player from '../player'

type SavedPlayer = Pick<Player, 'id' | 'name' | 'points'>

export default SavedPlayer
