<script lang="ts">
	import type SavedPlayer from '../../../shared/game/saved/player.js'
	import Point from '../../../icons/Point.svelte'

	export let players: SavedPlayer[]
	export let index: number

	$: player = players[index]
</script>

<article aria-hidden={!player}>
	<p class="name">
		{#if player}
			{player.name}
		{:else}
			{@html '&nbsp;'}
		{/if}
	</p>
	<p class="info">
		<span class="rank">
			{#if player}
				#{index + 1}
			{:else}
				{@html '&nbsp;'}
			{/if}
		</span>
		<span class="points">
			{#if player}
				<Point />
				{player.points}
			{:else}
				{@html '&nbsp;'}
			{/if}
		</span>
	</p>
</article>

<style lang="scss">
	@use 'shared/colors';

	article {
		width: 8rem;
		font-weight: 700;
		color: colors.$text;
	}

	[aria-hidden='true'] {
		user-select: none;
	}

	.name {
		margin-bottom: 0.4rem;
		padding-bottom: 0.6rem;
		white-space: nowrap;
		text-align: center;
		font-size: 1.5rem;
		border-bottom: 0.125rem solid colors.$border;
	}

	.info,
	.points {
		display: flex;
		align-items: center;
	}

	.info {
		justify-content: space-between;
	}

	.points > :global(svg) {
		height: 1em;
		margin-right: 0.3em;
	}
</style>
