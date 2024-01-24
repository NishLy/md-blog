<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { fetchApi } from '$lib/utils/httpWrapper';
	import { simplyfyNumber } from '$lib/utils/number';
	import { onMount } from 'svelte';

	export let data;
	let route = '';

	let isFollowing = false;

	page.subscribe((cur) => {
		const split = (cur.route.id ?? '').split('/');
		route = split[split.length - 1];
	});

	onMount(async () => {
		if (!browser) return;

		try {
			const user: any = await data.getAuthUser();
			if (!user) return;
			const res = await fetchApi(`/api/self/follow/user/${data.userData?.uid}?uid=${user.uid}`);

			isFollowing = res.body.isFollowing;
		} catch (error) {
			console.log(error);
		}
	});

	async function toogleFollow() {
		if (!browser) return;
		if (!(await data.invokeProtected(`Never miss a story from ${data.userData?.displayName}`)))
			return;
		try {
			const user: any = await data.getAuthUser();
			await fetchApi(`/api/self/follow/user/${data.userData?.uid}`, {
				method: 'POST',
				body: JSON.stringify({
					uid: user.uid
				})
			});

			isFollowing = !isFollowing;
		} catch (error) {
			console.log(error);
		}
	}
</script>

<div class="flex flex-col gap-4 p-4">
	<div class="flex flex-col gap-4">
		<div class="flex gap-4 items-center">
			<!-- svelte-ignore a11y-img-redundant-alt -->
			<img
				src={data.userData?.photoURL ?? '/images/default-profile.png'}
				alt="User Profile Picture"
				class="w-12 h-12 rounded-full"
			/>
			<div>
				<h1 class="text-lg font-bold">{data.userData?.displayName}</h1>
				<p class="text-sm text-neutral-800 dark:text-neutral-400">
					{simplyfyNumber(data.userData?.followers ?? 0)} Followers
				</p>
			</div>
		</div>
		<div class="hidden lg:block">
			<p>
				{data.userData?.about ?? 'This user has not written anything about themselves yet.'}
			</p>
		</div>
		<div class="flex justify-between mt-4">
			<button
				on:click={toogleFollow}
				class="btn btn-primary dark:bg-white py-2 px-4 rounded-2xl dark:text-black"
				>{isFollowing ? 'Unfollow' : 'Follow'}</button
			>
			<button
				title={'Subscribe to ' + '' + "'s newsletter"}
				class="btn btn-primary dark:bg-white p-2 w-10 h-10 rounded-full dark:text-black"
				><i class="fa-solid fa-envelope"></i></button
			>
		</div>
	</div>

	<div>
		<ul class="flex gap-4 border-b-[1px] border-white/30 pb-2">
			<li>
				<a class={route === '[slug]' ? 'border-b-[1px] border-white pb-2' : ''} href="./"> Home </a>
			</li>
			<li>
				<a
					class={route === 'about' ? 'border-b-[1px] border-white pb-2' : ''}
					href={'/user/' + data.userData?.uid + '/about'}
				>
					About
				</a>
			</li>
			<li>
				<a
					class={route === 'following' ? 'border-b-[1px] border-white pb-2' : ''}
					href={'/user/' + data.userData?.uid + '/following'}
				>
					Following
				</a>
			</li>
		</ul>
	</div>

	<slot />
</div>
