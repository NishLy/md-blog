<script lang="ts">
	import { browser } from '$app/environment';
	import { doc } from 'firebase/firestore';
	import ResponseBox from './ResponseBox.svelte';

	export let showResponses: boolean = true;

	$: (() => {
		if (!browser) return;
		if (!showResponses) document.body.style.overflow = 'auto';
		else document.body.style.overflow = 'hidden';
	})();

	let onClose = () => {
		showResponses = false;
	};
</script>

{#if showResponses}
	<div
		class="w-screen fixed bottom-0 mobile-responses-height rounded-t-md left-0 p-4 bg-neutral-100 box-border overflow-y-auto"
	>
		<div class="bound">
			<div class="dark:text-black flex justify-between items-center">
				<h4>Responses</h4>
				<button on:click={onClose}>X</button>
			</div>
			<textarea
				class="w-full mt-4 mb-12 p-4 rounded-sm shadow-md"
				rows="2"
				placeholder="What's your thoughs"
			></textarea>
		</div>
		<hr />
		<div class="flex flex-col gap-4 my-4">
			<ResponseBox
				replies={1}
				photoURL={'https://avatars.githubusercontent.com/u/54907004?v=4'}
				text={`Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam vel fugit minus at quod nostrum
			earum dicta! Doloremque, mollitia? Porro totam eius veritatis. Ratione reiciendis nihil sunt praesentium
			explicabo, delectus iusto commodi molestias dolor voluptatem quia illo. Quas esse et tenetur ipsam,
			non facilis. Facilis, ratione beatae quidem, aliquid tenetur quos corrupti architecto id enim ullam
			doloremque debitis delectus dignissimos perferendis repellat excepturi praesentium ipsam saepe
			est voluptatibus. Commodi veritatis laudantium accusantium, ut atque nihil labore, ad voluptatibus
			odit, eveniet quod cumque necessitatibus aliquam officiis non delectus consectetur repellendus
			laborum minima cum quam quae saepe? Iure reiciendis sint esse quod!`}
				date={new Date()}
				displayName={'Adhi'}
				likes={0}
				components={[
					{
						component: ResponseBox,
						props: {
							replies: 0,
							photoURL: 'https://avatars.githubusercontent.com/u/54907004?v=4',
							text: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam vel fugit minus at quod nostrum
					earum dicta! Doloremque, mollitia? Porro totam eius veritatis. Ratione reiciendis nihil sunt praesentium
					explicabo, delectus iusto commodi molestias dolor voluptatem quia illo. Quas esse et tenetur ipsam,
					non facilis. Facilis, ratione beatae quidem, aliquid tenetur quos corrupti architecto id enim ullam
					doloremque debitis delectus dignissimos perferendis repellat excepturi praesentium ipsam saepe
					est voluptatibus. Commodi veritatis laudantium accusantium, ut atque nihil labore, ad voluptatibus
					odit, eveniet quod cumque necessitatibus aliquam officiis non delectus consectetur repellendus
					laborum minima cum quam quae saepe? Iure reiciendis sint esse quod!`,
							date: new Date(),
							displayName: 'Dio Satrio',
							likes: 0,
							components: [
								{
									component: ResponseBox,
									props: {
										replies: 0,
										photoURL: 'https://avatars.githubusercontent.com/u/54907004?v=4',
										text: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam vel fugit minus at quod nostrum
							earum dicta! Doloremque, mollitia? Porro totam eius veritatis. Ratione reiciendis nihil sunt praesentium
							explicabo, delectus iusto commodi molestias dolor voluptatem quia illo. Quas esse et tenetur ipsam,
							non facilis. Facilis, ratione beatae quidem, aliquid tenetur quos corrupti architecto id enim ullam
							doloremque debitis delectus dignissimos perferendis repellat excepturi praesentium ipsam saepe
							est voluptatibus. Commodi veritatis laudantium accusantium, ut atque nihil labore, ad voluptatibus
							odit, eveniet quod cumque necessitatibus aliquam officiis non delectus consectetur repellendus
							laborum minima cum quam quae saepe? Iure reiciendis sint esse quod!`,
										date: new Date(),
										displayName: 'Dio Satrio',
										likes: 0
									}
								}
							]
						}
					},
					{
						component: ResponseBox,
						props: {
							replies: 0,
							photoURL: 'https://avatars.githubusercontent.com/u/54907004?v=4',
							text: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam vel fugit minus at quod nostrum
					earum dicta! Doloremque, mollitia? Porro totam eius veritatis. Ratione reiciendis nihil sunt praesentium
					explicabo, delectus iusto commodi molestias dolor voluptatem quia illo. Quas esse et tenetur ipsam,
					non facilis. Facilis, ratione beatae quidem, aliquid tenetur quos corrupti architecto id enim ullam
					doloremque debitis delectus dignissimos perferendis repellat excepturi praesentium ipsam saepe
					est voluptatibus. Commodi veritatis laudantium accusantium, ut atque nihil labore, ad voluptatibus
					odit, eveniet quod cumque necessitatibus aliquam officiis non delectus consectetur repellendus
					laborum minima cum quam quae saepe? Iure reiciendis sint esse quod!`,
							date: new Date(),
							displayName: 'Dian Satrio',
							likes: 0
						}
					}
				]}
			/>
			/>
		</div>
	</div>
{/if}

<style>
	.mobile-responses-height {
		height: calc(100vh - 4rem);
	}
</style>
