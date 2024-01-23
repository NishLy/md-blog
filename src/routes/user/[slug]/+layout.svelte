<script>
	import { page } from '$app/stores';
	import { simplyfyNumber } from '$lib/utils/number';

	/** @type {import('./$types').LayoutData} */
	export let data;
	let route = '';

	page.subscribe((cur) => {
		const split = (cur.route.id ?? '').split('/');
		route = split[split.length - 1];
	});
</script>

<div class="flex flex-col gap-4 p-4">
	<div class="flex flex-col gap-4">
		<div class="flex gap-4 items-center">
			<img
				src="https://avatars.githubusercontent.com/u/101114055?v=4"
				alt=""
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
				Lorem ipsum dolor, sit amet consectetur adipisicing elit. Provident accusamus neque, quis
				voluptas odio dolorum, totam delectus magni facere saepe nulla sunt corrupti rerum dolor
				corporis laudantium error enim atque unde blanditiis
			</p>
		</div>
		<div class="flex justify-between mt-4">
			<button class="btn btn-primary dark:bg-white py-2 px-4 rounded-2xl dark:text-black"
				>Follow</button
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
		</ul>
	</div>

	<slot />
</div>
