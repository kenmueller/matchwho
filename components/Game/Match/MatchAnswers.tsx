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

import GameContext from '../../../lib/game/context'
import GameStreamContext from '../../../lib/game/context/stream'
import theme from '../../../lib/theme'
import alertError from '../../../lib/error/alert'
import Point from '../../../lib/point'
import Link from './Link'
import getBounds from '../../../lib/bounds/get'
import boundsContains from '../../../lib/bounds/contains'
import ScrollViewContext from '../../../lib/scrollView/context'
import boundsRelativeTo from '../../../lib/bounds/relative'
import addPoints from '../../../lib/point/add'

/** How far away the link is from the node. */
const SPACING = 8

const shouldSetResponder = () => true
const responderTerminationRequest = () => false

const GameMatchAnswers = () => {
	const dimensions = useWindowDimensions()

	const [gameStream] = useContext(GameStreamContext)
	const [game] = useContext(GameContext)
	if (!(gameStream && game)) return null

	const scrollView = useContext(ScrollViewContext)
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

	const onPlayerStart = useCallback(
		(player: string) =>
			({ nativeEvent: { pageX, pageY } }: GestureResponderEvent) => {
				scrollView.current?.setNativeProps({ scrollEnabled: false })

				setStart({ x: pageX, y: pageY })
				setEnd(null)

				playerLink === null ? setPlayerLink(player) : resetLink()
			},
		[scrollView, setStart, setEnd, playerLink, setPlayerLink, resetLink]
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
				scrollView.current?.setNativeProps({ scrollEnabled: true })

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
		[scrollView, answers, answerNodes, setAnswerLink, resetLink]
	)

	const onAnswerStart = useCallback(
		(answer: number) =>
			({ nativeEvent: { pageX, pageY } }: GestureResponderEvent) => {
				scrollView.current?.setNativeProps({ scrollEnabled: false })

				setStart({ x: pageX, y: pageY })
				setEnd(null)

				answerLink === null ? setAnswerLink(answer) : resetLink()
			},
		[scrollView, setStart, setEnd, answerLink, setAnswerLink, resetLink]
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
				scrollView.current?.setNativeProps({ scrollEnabled: true })

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
		[scrollView, players, playerNodes, setPlayerLink, resetLink]
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

	const getNodeLinkPositions = useCallback(async () => {
		if (!root.current) return {}
		const rootBounds = await getBounds(root.current)

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
	}, [root, playerNodes, answerNodes])

	useEffect(() => {
		getNodeLinkPositions().then(setNodeLinkPositions)
	}, [getNodeLinkPositions, setNodeLinkPositions, matches, dimensions])

	useEffect(() => {
		// Fix offset match bug

		setTimeout(() => {
			getNodeLinkPositions().then(setNodeLinkPositions)
		}, 500)
	}, [getNodeLinkPositions, setNodeLinkPositions])

	const [columnLayout, _setColumnLayout] = useState<{
		width: number
		gap: number
	} | null>(null)

	const setColumnLayout = useCallback(async () => {
		if (!root.current) return
		const bounds = await getBounds(root.current)

		const gap =
			bounds.width < 350
				? 50
				: bounds.width < 500
				? 100
				: bounds.width < 800
				? 150
				: 200
		const width = (bounds.width - gap) / 2

		_setColumnLayout({ width, gap })
	}, [root, _setColumnLayout])

	useEffect(() => {
		setColumnLayout()
	}, [setColumnLayout, dimensions])

	return (
		<View
			ref={current => (root.current = current)}
			onLayout={setColumnLayout}
			style={styles.root}
		>
			<Text style={styles.question}>
				{game.turn?.question ?? '(error)'}
			</Text>
			<View
				pointerEvents={disabled ? 'none' : 'auto'}
				style={styles.columns}
			>
				{columnLayout && (
					<>
						<View
							style={[
								styles.players,
								{ width: columnLayout.width }
							]}
						>
							<Text style={styles.title}>Players</Text>
							{players.map(player => (
								<View
									key={player.id}
									ref={current => {
										current
											? (playerNodes.current[player.id] =
													current)
											: delete playerNodes.current[
													player.id
											  ]
									}}
									onStartShouldSetResponder={
										shouldSetResponder
									}
									onResponderStart={onPlayerStart(player.id)}
									onResponderMove={onPlayerMove(player.id)}
									onResponderEnd={onPlayerEnd(player.id)}
									onResponderTerminationRequest={
										responderTerminationRequest
									}
									style={[
										styles.node,
										Platform.OS === 'web' && {
											// @ts-ignore
											cursor: dragging
												? 'default'
												: 'pointer'
										}
									]}
								>
									<Text style={styles.nodeText}>
										{player.name}
									</Text>
								</View>
							))}
						</View>
						<View
							style={[
								styles.answers,
								{
									width: columnLayout.width,
									marginLeft: columnLayout.gap
								}
							]}
						>
							<Text style={styles.title}>Answers</Text>
							{answers.map((answer, index) => (
								<View
									key={index}
									ref={current => {
										current
											? (answerNodes.current[
													index.toString()
											  ] = current)
											: delete answerNodes.current[
													index.toString()
											  ]
									}}
									onStartShouldSetResponder={
										shouldSetResponder
									}
									onResponderStart={onAnswerStart(index)}
									onResponderMove={onAnswerMove(index)}
									onResponderEnd={onAnswerEnd(index)}
									onResponderTerminationRequest={
										responderTerminationRequest
									}
									style={[
										styles.node,
										Platform.OS === 'web' && {
											// @ts-ignore
											cursor: dragging
												? 'default'
												: 'pointer'
										}
									]}
								>
									<Text style={styles.nodeText}>
										{answer}
									</Text>
								</View>
							))}
						</View>
					</>
				)}
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
			{nodeLinkPositions &&
				(correct?.matches ?? matches).map(
					([player, answerIndex]) =>
						player in nodeLinkPositions &&
						answerIndex.toString() in nodeLinkPositions && (
							<Link
								key={player}
								from={nodeLinkPositions[player]}
								to={nodeLinkPositions[answerIndex.toString()]}
								onPress={
									disabled ? undefined : () => unmatch(player)
								}
							/>
						)
				)}
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
		alignItems: 'center',
		width: '100%'
	},
	question: {
		width: '100%',
		maxWidth: 600,
		fontSize: 22,
		fontWeight: '700',
		color: theme.white,
		opacity: 0.5
	},
	columns: {
		flexDirection: 'row',
		alignItems: 'stretch',
		marginTop: 16,
		width: '100%'
	},
	players: {
		alignItems: 'flex-end'
	},
	answers: {
		alignItems: 'flex-start'
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
		color: theme.white,
		...(Platform.OS === 'web' ? { wordBreak: 'break-word' } : {})
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
