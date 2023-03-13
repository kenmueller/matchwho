import { createContext } from 'react'

import RootEvents from '.'

const RootEventsContext = createContext<RootEvents>(undefined as never)

export default RootEventsContext
