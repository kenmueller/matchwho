import {
	useContext,
	useRef,
	useState,
	useMemo,
	useCallback,
	useEffect
} from 'react'
import {
	Text,
	StyleSheet,
	View,
	TouchableOpacity,
	GestureResponderEvent,
	Platform,
	useWindowDimensions
} from 'react-native'
import { Portal } from '@gorhom/portal'

import GameContext from '../../lib/game/context'
import GameStreamContext from '../../lib/game/context/stream'
import theme from '../../lib/theme'
import alertError from '../../lib/error/alert'
import Point from '../../lib/point'
import Link from './Link'
import getBounds from '../../lib/bounds/get'
import boundsContains from '../../lib/bounds/contains'
import ScrollEnabledContext from '../../lib/scrollEnabled/context'
import boundsRelativeTo from '../../lib/bounds/relative'
import addPoints from '../../lib/point/add'

/** How far away the link is from the node. */
const SPACING = 8

const GameMatchAnswers = () => {
	const dimensions = useWindowDimensions()

	const [gameStream] = useContext(GameStreamContext)
	const [game] = useContext(GameContext)
	if (!(gameStream && game)) return null

	const [, setScrollEnabled] = useContext(ScrollEnabledContext)

	const root = useRef<View | null>(null)

	const playerNodes = useRef<Record<string, View>>({})
	const answerNodes = useRef<Record<string, View>>({})

	const [nodeLinkPositions, setNodeLinkPositions] = useState<Record<
		string,
		Point
	> | null>(null)

	const [start, setStart] = useState<Point | null>(null)
	const [end, setEnd] = useState<Point | null>(null)

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

	const resetLink = useCallback(() => {
		setPlayerLink(null)
		setAnswerLink(null)
	}, [setPlayerLink, setAnswerLink])

	const shouldSetResponder = useCallback(() => {
		setScrollEnabled(false)
		return true
	}, [setScrollEnabled])

	const onPlayerStart = useCallback(
		(player: string) =>
			({ nativeEvent: { pageX, pageY } }: GestureResponderEvent) => {
				setStart({ x: pageX, y: pageY })
				setEnd(null)

				playerLink === null ? setPlayerLink(player) : resetLink()
			},
		[setStart, setEnd, playerLink, setPlayerLink, resetLink]
	)

	const onPlayerMove = useCallback(
		(_player: string) =>
			({ nativeEvent: { pageX, pageY } }: GestureResponderEvent) => {
				setEnd({ x: pageX, y: pageY })
			},
		[setEnd]
	)

	const onPlayerEnd = useCallback(
		(_player: string) =>
			async ({
				nativeEvent: { pageX, pageY }
			}: GestureResponderEvent) => {
				const point: Point = { x: pageX, y: pageY }

				const map = await Promise.all(
					answers.map(
						async (_answer, index) =>
							[
								index,
								await getBounds(
									answerNodes.current[index.toString()]
								)
							] as const
					)
				)

				for (const [index, bounds] of map)
					if (boundsContains(bounds, point)) {
						setAnswerLink(index)
						return
					}

				resetLink()
			},
		[answers, answerNodes, setAnswerLink, resetLink]
	)

	const onAnswerStart = useCallback(
		(answer: number) =>
			({ nativeEvent: { pageX, pageY } }: GestureResponderEvent) => {
				setStart({ x: pageX, y: pageY })
				setEnd(null)

				answerLink === null ? setAnswerLink(answer) : resetLink()
			},
		[setStart, setEnd, answerLink, setAnswerLink, resetLink]
	)

	const onAnswerMove = useCallback(
		(_answer: number) =>
			({ nativeEvent: { pageX, pageY } }: GestureResponderEvent) => {
				setEnd({ x: pageX, y: pageY })
			},
		[setEnd]
	)

	const onAnswerEnd = useCallback(
		(_answer: number) =>
			async ({
				nativeEvent: { pageX, pageY }
			}: GestureResponderEvent) => {
				const point: Point = { x: pageX, y: pageY }

				const map = await Promise.all(
					players.map(
						async player =>
							[
								player.id,
								await getBounds(playerNodes.current[player.id])
							] as const
					)
				)

				for (const [player, bounds] of map)
					if (boundsContains(bounds, point)) {
						setPlayerLink(player)
						return
					}

				resetLink()
			},
		[players, playerNodes, setPlayerLink, resetLink]
	)

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

	const getNodeLinkPositions = useCallback(
		async (root: View) => {
			const rootBounds = await getBounds(root)

			const positions = await Promise.all([
				...Object.entries(playerNodes.current).map(
					async ([player, node]) => {
						const nodeBounds = await getBounds(node)
						const relativeBounds = boundsRelativeTo(
							nodeBounds,
							rootBounds
						)

						return [
							player,
							addPoints(relativeBounds, {
								x: nodeBounds.width + SPACING,
								y: nodeBounds.height / 2
							})
						] as const
					}
				),
				...Object.entries(answerNodes.current).map(
					async ([index, node]) => {
						const nodeBounds = await getBounds(node)
						const relativeBounds = boundsRelativeTo(
							nodeBounds,
							rootBounds
						)

						return [
							index,
							addPoints(relativeBounds, {
								x: -SPACING,
								y: nodeBounds.height / 2
							})
						] as const
					}
				)
			])

			return Object.fromEntries(positions)
		},
		[playerNodes, answerNodes]
	)

	useEffect(() => {
		if (!root.current) return
		getNodeLinkPositions(root.current).then(setNodeLinkPositions)
	}, [root, setNodeLinkPositions, dimensions])

	useEffect(() => {
		setScrollEnabled(!dragging)
	}, [dragging, setScrollEnabled])

	return (
		<View ref={current => (root.current = current)} style={styles.root}>
			<Text style={styles.question}>
				{game.turn?.question ?? '(error)'}
			</Text>
			<View
				pointerEvents={disabled ? 'none' : 'auto'}
				style={styles.columns}
			>
				<View style={styles.players}>
					<Text style={styles.title}>Players</Text>
					{players.map(player => (
						<View
							key={player.id}
							ref={current => {
								current
									? (playerNodes.current[player.id] = current)
									: delete playerNodes.current[player.id]
							}}
							onStartShouldSetResponder={shouldSetResponder}
							onResponderStart={onPlayerStart(player.id)}
							onResponderMove={onPlayerMove(player.id)}
							onResponderEnd={onPlayerEnd(player.id)}
							style={[
								styles.node,
								Platform.OS === 'web' && {
									// @ts-ignore
									cursor: dragging ? 'default' : 'pointer'
								}
							]}
						>
							<Text style={styles.nodeText}>{player.name}</Text>
						</View>
					))}
				</View>
				<View style={styles.answers}>
					<Text style={styles.title}>Answers</Text>
					{answers.map((answer, index) => (
						<View
							key={index}
							ref={current => {
								current
									? (answerNodes.current[index.toString()] =
											current)
									: delete answerNodes.current[
											index.toString()
									  ]
							}}
							onStartShouldSetResponder={shouldSetResponder}
							onResponderStart={onAnswerStart(index)}
							onResponderMove={onAnswerMove(index)}
							onResponderEnd={onAnswerEnd(index)}
							style={[
								styles.node,
								Platform.OS === 'web' && {
									// @ts-ignore
									cursor: dragging ? 'default' : 'pointer'
								}
							]}
						>
							<Text style={styles.nodeText}>{answer}</Text>
						</View>
					))}
				</View>
			</View>
			{correct ? (
				<Text style={styles.correct}>
					Showing correct answers ({correct.count}/
					{correct.matches.length})
				</Text>
			) : disabled && current ? (
				<Text style={styles.matching}>
					Waiting for {current.name} to finish matching
				</Text>
			) : null}
			{myTurn && (
				<TouchableOpacity
					disabled={submitLoading || submitDisabled}
					onPress={correct ? done : matched}
					style={[
						styles.submit,
						correct && styles.submitCorrect,
						(submitLoading || submitDisabled) &&
							styles.submitDisabled
					]}
				>
					<Text style={styles.submitText}>
						{correct ? 'Done' : 'Show Correct Matches'}
					</Text>
				</TouchableOpacity>
			)}
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			<Text style={{ color: 'white' }}>Hello</Text>
			{nodeLinkPositions &&
				(correct?.matches ?? matches).map(([player, answerIndex]) => (
					<Link
						key={player}
						from={nodeLinkPositions[player]}
						to={nodeLinkPositions[answerIndex.toString()]}
						onPress={disabled ? undefined : () => unmatch(player)}
					/>
				))}
			<Portal>
				{!disabled && dragging && start && end && (
					// Link to mouse cursor
					<Link from={start} to={end} />
				)}
			</Portal>
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		position: 'relative',
		alignItems: 'center'
	},
	question: {
		alignSelf: 'flex-start',
		fontSize: 22,
		fontWeight: '700',
		color: theme.white,
		opacity: 0.5
	},
	columns: {
		flexDirection: 'row',
		alignItems: 'stretch',
		marginTop: 16
	},
	players: {
		alignItems: 'flex-end'
	},
	answers: {
		alignItems: 'flex-start',
		marginLeft: 100
	},
	title: {
		fontSize: 22,
		fontWeight: '700',
		color: theme.white
	},
	node: {
		marginTop: 16,
		paddingVertical: 8,
		paddingHorizontal: 16,
		backgroundColor: theme.darkGray,
		borderRadius: 8
	},
	nodeText: {
		fontSize: 16,
		fontWeight: '700',
		color: theme.white
	},
	correct: {
		// Must add to submit.marginTop to prevent layout from shifting
		marginTop: 12,
		height: 20,
		marginBottom: 4,

		fontSize: 16,
		fontWeight: '700',
		color: theme.yellow
	},
	matching: {
		marginTop: 28,
		fontSize: 16,
		fontWeight: '700',
		color: theme.yellow
	},
	submit: {
		marginTop: 36,
		paddingVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: theme.yellowWithOpacity(0.4),
		borderRadius: 16
	},
	submitText: {
		fontSize: 20,
		fontWeight: '700',
		color: theme.yellow
	},
	submitCorrect: {
		marginTop: 0
	},
	submitDisabled: {
		opacity: 0.5
	}
})

export default GameMatchAnswers
