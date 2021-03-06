const closeMessage = (_element: HTMLElement, message: string | null) => {
	const handler = (event: BeforeUnloadEvent) => {
		event.preventDefault()
		event.returnValue = message

		return message
	}

	if (message) window.addEventListener('beforeunload', handler)

	return {
		change: (newMessage: string | null) => {
			message = newMessage

			message
				? window.addEventListener('beforeunload', handler)
				: window.removeEventListener('beforeunload', handler)
		},
		destroy: () => {
			if (message) window.removeEventListener('beforeunload', handler)
		}
	}
}

export default closeMessage
