<script lang="ts">
	import { auth } from '$lib/firebase.client';
	import { session, userDataStore, type User } from '$lib/state/session';
	import { sidemenu } from '$lib/state/sidemenu';
	import { signOut } from 'firebase/auth';

	let isOpen: boolean = true;

	sidemenu.subscribe((s) => {
		isOpen = s.isOpen;
	});

	let user: User = {
		displayName: '',
		email: '',
		photoURL: '',
		uid: ''
	};

	session.subscribe((s) => {
		if (!s?.user) return;
		user = s.user;
	});

	const logout = () => {
		session.set({
			loggedIn: false,
			user: null
		});
		userDataStore.set(null);
		sidemenu.set({ isOpen: false });
		signOut(auth);
	};
</script>

<ul
	class={'z-50 fixed top-[4.5rem] right-0 w-screen bg-white dark:bg-neutral-500 dark:text-white flex flex-col gap-4 p-4 transition-all duration-300 ease-in-out transform ' +
		(isOpen ? 'translate-x-[0]' : 'translate-x-[200vh]')}
>
	<di class="flex gap-2 items-center">
		<img class="rounded-full w-12 h-12 flex-shrink-0" src={user.photoURL} alt="profile" />
		<div>
			<p class="font-semibold">{user.displayName}</p>
			<p class="">{user.email}</p>
			<a class=" text-blue-200" href={'/user/' + user.uid}>See your page</a>
		</div>
	</di>

	<hr />
	<li class="flex gap-4 items-center p-4">
		<i class="fa-solid fa-right-from-bracket"></i>
		<button on:click={logout}>Logout</button>
	</li>
</ul>
