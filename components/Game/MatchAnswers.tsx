import {
	useContext,
	useRef,
	useState,
	useMemo,
	useCallback,
	useEffect
} from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'

import GameContext from '../../lib/game/context'
import GameStreamContext from '../../lib/game/context/stream'
import theme from '../../lib/theme'
import alertError from '../../lib/error/alert'

const GameMatchAnswers = () => {
	const [gameStream] = useContext(GameStreamContext)
	const [game] = useContext(GameContext)
	if (!(gameStream && game)) return null

	const elements = useRef<Record<string | number, View>>({})
	// let point: Point | null = null

	const [playerLink, setPlayerLink] = useState<string | null>(null)
	const [answerLink, setAnswerLink] = useState<number | null>(null)

	const [loadingMatched, setLoadingMatched] = useState(false)
	const [loadingDone, setLoadingDone] = useState(false)

	const current = game.turn && game.turn.player

	const players = useMemo(
		() => game.players.filter(({ id }) => id !== current?.id),
		[game, current]
	)

	// One player link or one answer link
	const dragging = (playerLink === null) !== (answerLink === null)

	const answers = useMemo(() => game.turn?.answers ?? [], [game])
	const matches = useMemo(
		() => Object.entries(game.turn?.matches ?? {}),
		[game]
	)

	const correct = useMemo(
		() =>
			game.turn?.correct && {
				count: game.turn.correct.count,
				matches: Object.entries(game.turn.correct.matches)
			},
		[game]
	)

	const myTurn = current && current.id === game.self?.id
	const disabled = !(myTurn && correct == null)

	const isMatched = answers.length === matches.length

	const submitLoading = correct ? loadingDone : loadingMatched
	const submitDisabled = !(correct || isMatched)

	// const setPoint = (event: MouseEvent) => {
	// 	event.stopPropagation()
	// 	point = { x: event.clientX, y: event.clientY }
	// }

	// const setPlayerLink = (player: Player) => (event: MouseEvent) => {
	// 	setPoint(event)
	// 	playerLink === null ? (playerLink = player.id) : resetLink()
	// }

	// const setAnswerLink = (index: number) => (event: MouseEvent) => {
	// 	setPoint(event)
	// 	answerLink === null ? (answerLink = index) : resetLink()
	// }

	const resetLink = useCallback(() => {
		setPlayerLink(null)
		setAnswerLink(null)
	}, [setPlayerLink, setAnswerLink])

	const unmatch = useCallback(
		(player: string) => {
			try {
				gameStream.send({ key: 'unmatch', value: player })
			} catch (error) {
				alertError(error)
			}
		},
		[gameStream]
	)

	const matched = useCallback(() => {
		try {
			setLoadingMatched(true)
			gameStream.send({ key: 'matched' })
		} catch (error) {
			setLoadingMatched(false)
			alertError(error)
		}
	}, [gameStream, setLoadingMatched])

	const done = useCallback(() => {
		try {
			setLoadingDone(true)
			gameStream.send({ key: 'done' })
		} catch (error) {
			setLoadingDone(false)
			alertError(error)
		}
	}, [gameStream, setLoadingDone])

	useEffect(() => {
		try {
			if (playerLink === null || answerLink === null) return

			gameStream.send({
				key: 'match',
				value: { player: playerLink, answer: answerLink }
			})

			resetLink()
		} catch (error) {
			alertError(error)
		}
	}, [gameStream, playerLink, answerLink, resetLink])

	return (
		<View style={styles.root}>
			<Text style={styles.question}>
				{game.turn?.question ?? '(error)'}
			</Text>
			<View style={[styles.columns, disabled && styles.matchingDisabled]}>
				<View style={styles.players}>
					<Text style={[styles.title, styles.playersTitle]}>
						Players
					</Text>
					{players.map(player => (
						<View
							key={player.id}
							ref={current => {
								current
									? (elements.current[player.id] = current)
									: delete elements.current[player.id]
							}}
							style={styles.node}
						>
							<Text style={styles.nodeText}>{player.name}</Text>
						</View>
					))}
				</View>
				<View style={styles.answers}>
					<Text style={[styles.title, styles.answersTitle]}>
						Answers
					</Text>
					{answers.map((answer, index) => (
						<View
							key={index}
							ref={current => {
								current
									? (elements.current[index] = current)
									: delete elements.current[index]
							}}
							style={styles.node}
						>
							<Text style={styles.nodeText}>{answer}</Text>
						</View>
					))}
				</View>
			</View>
			{myTurn && (
				<TouchableOpacity
					disabled={submitLoading || submitDisabled}
					onPress={correct ? done : matched}
					styles={[
						(submitLoading || submitDisabled) &&
							styles.submitDisabled
					]}
				>
					<Text>{correct ? 'Done' : 'Show Correct Matches'}</Text>
				</TouchableOpacity>
			)}
		</View>
	)
}

const styles = StyleSheet.create({})

export default GameMatchAnswers
