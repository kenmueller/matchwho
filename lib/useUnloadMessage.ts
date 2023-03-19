import { useEffect } from 'react'

const useUnloadMessage = (message: string | null) => {
	useEffect(() => {
		if (!message) return

		const onBeforeUnload = (event: BeforeUnloadEvent) => {
			event.preventDefault()
			return (event.returnValue = message)
		}

		window.addEventListener('beforeunload', onBeforeUnload)

		return () => {
			window.removeEventListener('beforeunload', onBeforeUnload)
		}
	}, [message])
}

export default useUnloadMessage
