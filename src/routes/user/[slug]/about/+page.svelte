<script>
	import { simplyfyNumber } from '$lib/utils/number';
	import { printMonthYear } from '$lib/utils/date';

	export let data;
</script>

<div>
	<p>{data.userData?.about ?? 'This user has not written anything about themselves yet.'}</p>
	<p class="dark:text-neutral-300 mt-6">
		{data.app.name} member since {printMonthYear(new Date(data.userData?.createdAt ?? Date.now()))}
	</p>
</div>

<div>
	<p class="text-green-400">
		{simplyfyNumber(data.userData?.followers ?? 0)} Follower · {simplyfyNumber(
			data.userData?.following ?? 0
		)} Following
	</p>
</div>

<div class="flex flex-col gap-4">
	<p>Connect with {data.userData?.displayName}</p>
	<div>
		<i class="fa-brands fa-github fa-xl"></i>
	</div>
</div>
