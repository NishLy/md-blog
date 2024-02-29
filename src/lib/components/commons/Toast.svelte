<script lang="ts">
	import { Severity, toast } from '$lib/state/toast';

	let isVisible = false;
	let message = '';
	let severity: Severity;

	toast.subscribe((value) => {
		if (value) {
			isVisible = true;
			message = value.message;
			severity = value.severity;
		} else {
			isVisible = false;
		}
	});
</script>

{#if isVisible}
	<div class="fixed bottom-0 right-0 z-50 m-4 shadow-md">
		{#if severity === Severity.SUCCESS}
			<div class="bg-green-500 min-h-14 p-4 rounded-md text-white min-w-44">{message}</div>
		{:else if severity === Severity.ERROR}
			<div class="bg-red-500 min-h-14 p-4 rounded-md text-white min-w-44">{message}</div>
		{:else if severity === Severity.WARNING}
			<div class="bg-yellow-500 min-h-14 p-4 rounded-md text-white min-w-44">{message}</div>
		{:else if severity === Severity.INFO}
			<div class="bg-blue-500 min-h-14 p-4 rounded-md text-white min-w-44">{message}</div>
		{/if}
	</div>
{/if}
