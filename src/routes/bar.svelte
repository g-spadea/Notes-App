<script lang="ts">
	import logo from '$lib/assets/white-logo.svg';
</script>

<input id="menu-input" type="checkbox" />
<div class="hidden-content">
	<ul>
		<li>
			<a href="https://github.com/g-spadea/SAW" draggable="false">Github Repository</a>
		</li>
		<li>
			<a href="https://github.com/g-spadea" draggable="false">About</a>
		</li>
	</ul>
</div>
<div class="menu">
	<label class="menu-control" for="menu-input">
		<img src={logo} id="logo" alt="" draggable="false"/>
	</label>
	<div class="light-dark">
		<input class="switch-input" id="theme-switch" type="checkbox" />
		<label class="switch-control" for="theme-switch"></label>
	</div>
</div>

<slot />

<style>
	#logo {
		position: relative;
		z-index: 1;
		padding-bottom: 3%;
		display: block;
		max-width: 100%;
		width: 5.5vh;
		scale: 0.8;
		filter: drop-shadow(-4px 9px 7px rgb(0 0 0 / 0.5));
		transition: scale 0.5s;
		user-select: none;
	}

	#logo:hover {
		scale: 1;
		cursor: pointer;
	}

	.hidden-content {
		z-index: 1;
		position: fixed;
		display: flex;
		justify-content: center;
		scale: 0.5;
		align-items: center;
		visibility: hidden;
		opacity: 0;
		height: 100vh;
		width: 100vw;
		background-color: rgba(0, 0, 0, 0.85);
		color: white;
		transition:
			opacity 0.2s ease-in-out,
			visibility 0.2s ease-in-out,
			scale 0.3s;
	}

	.hidden-content ul {
		width: fit-content;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		align-items: center;
		list-style: none;
		font-size: 6vh;
	}

	.hidden-content ul li {
		padding: 5%;
		scale: 0.9;

		a {
			color: white;
			text-decoration: none;
		}

		&:hover {
			scale: 1.2;

			a {
				color: rgb(255, 0, 0);
				transition: color 0.4s;
			}

			transition: scale 0.4s;
		}
	}

	.menu {
		position: relative;
		z-index: 1;
		/* From https://css.glass */
		height: 10%;
		padding: 2%;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 10%;
	}

	#menu-input {
		display: none;
	}

	#menu-input:checked ~ .hidden-content {
		visibility: visible;
		opacity: 1;
		scale: 1;
	}

	.switch-input {
		display: none;
	}

	.switch-control {
		z-index: 1;
		display: flex;
  		justify-content: center;
		position: relative;
		width: 8vh;
		height: 4vh;
		background: #93e6ef;
		border-radius: 4cm;
		box-shadow:
			rgba(0, 0, 0, 0.3) 0px 1vw 3vw,
			rgba(0, 0, 0, 0.22) 0px 1vw 1vw;
		transition: background 0.25s ease-in-out;
		cursor: pointer;
		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 50%;
			height: 100%;
			background: #fbde0d;
			border-radius: inherit;
			box-shadow: 0 0 .6vw 0.1vw #fbde0d;
			transition:
				background 0.25s ease-in-out,
				box-shadow 0.25s ease-in-out,
				left 0.25s ease-in-out;
		}
	}

	.switch-input:checked + .switch-control {
		background: #3e5a98;
		&::before {
			left: 4vh;
			background: #fafbb2;
			box-shadow: 0 0 .6vw 0.1vw #fafbb2;
		}
	}

	@media only screen and (max-height: 500px), only screen and (max-width: 450px) {
		.menu {
			background: transparent;
			backdrop-filter: unset;
			-webkit-backdrop-filter: unset;
			border-radius: 0;
			border: none;
			box-shadow: none;
		}
	}
</style>
