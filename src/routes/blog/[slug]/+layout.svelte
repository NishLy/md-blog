<script lang="ts">
	import Comments from '$lib/components/Comments.svelte';

	export let data;
</script>

<slot />
<Comments blogId={data.props.slug} />
