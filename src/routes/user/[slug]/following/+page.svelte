<script lang="ts">
	export let data;
</script>

<div class="flex gap-2 text-sm">
	<a href={`/user/${data.userData?.uid}`} class="truncate w-36 dark:text-neutral-300"
		>{data.userData?.displayName}</a
	>
	{'>'}
	<span>Following</span>
</div>
<h3>
	{#if data.following}
		{data.following.length} Following
	{:else}
		0 Following
	{/if}
</h3>
<div class="flex flex-col gap-6">
	{#if data.isPrivate}
		<p>This user's following list is private</p>
	{:else if data.following}
		{#each data.following as user}
			<a class="flex gap-2 items-start cursor-pointer" href={`/user/${user.uid}`}>
				<img src={user.photoURL} alt="" class="w-10 h-10 rounded-full" />
				<div>
					<h6 class="w-60 truncate">{user.displayName}</h6>
					<p class="text-sm dark:text-neutral-300">
						{user.about ? user.about : ''} sa dsadsadsa sdsadas
					</p>
				</div>
			</a>
		{/each}
	{/if}
</div>
