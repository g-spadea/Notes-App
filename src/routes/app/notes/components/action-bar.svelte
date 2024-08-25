<script lang="ts">
    import filterImage from "$lib/assets/filter.svg"

	let sort: HTMLLabelElement, filter: HTMLLabelElement;
    let text: string = $state('');
    let notes: NodeListOf<HTMLElement> = $state()!;
	let searchCheck: boolean | undefined = $state();
	let dateSort: HTMLButtonElement;
	let nameSort: HTMLButtonElement;
	let sortMethod: HTMLButtonElement|undefined = $state();
	let observer: MutationObserver;

	function press(evt: KeyboardEvent, target: HTMLButtonElement){
		evt.code === "Enter" ? target.parentElement!.click() : evt.stopPropagation();
	}

	function filterNotes(notes: NodeListOf<HTMLElement>, text: string){
		for(let note=0; note < notes.length; note++){
			if(note == 0) continue;
			if(notes[note].id.length < text.length) {
				notes[note].style.display='none';
				continue;
			}
			
			if(notes[note].id.slice(0, text.length) === text || text === '')
				notes[note].style.display='';
			else
				notes[note].style.display='none';
		}
	}
	
	$effect(() => {
		
		if(!observer){
			observer = new MutationObserver(() => {
				notes = document.querySelectorAll('.note');
			});

			observer.observe(document.querySelector('.notes')!, { 
				attributes: true, 
				childList: true, 
				subtree: true 
			});
		}

		if(!sortMethod) sortMethod = dateSort;
		if(!notes) notes = document.querySelectorAll('.note');
		if(!searchCheck) text = '';

		filterNotes(notes, text);

		if(sortMethod === dateSort){
			dateSort.style.background = 'light-dark(rgba(255, 115, 1, 0.631),rgba(255, 106, 0, 0.335))'
			nameSort.style.background = 'inherit'
		}
		else {
			nameSort.style.background = 'light-dark(rgba(255, 115, 1, 0.631),rgba(255, 106, 0, 0.335))'
			dateSort.style.background = 'inherit'
		}

	})
</script>

<div class="search-bar">
    <input id="sort" type="checkbox">
    <input id="search" type="checkbox" bind:checked={searchCheck}>
    <!-- TODO: BACKDROP LIST SORT --> 
    <div class="sort-method">
		<button bind:this={dateSort} formaction="?/dateSort" type="submit" onclick={() => sortMethod = dateSort}>Date</button>
        <button bind:this={nameSort} formaction="?/nameSort" type="submit" onclick={() => sortMethod = nameSort}>Name</button>
    </div>
	<label bind:this={sort} class="sort-label" for="sort" draggable="false">
		<button type="button" class="button-sort" onkeypress={(evt) => press(evt, evt.currentTarget)}>
			<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
				<path d="M120-240v-80h240v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Z"/>
			</svg>
		</button>
	</label>
    <input id="text" type="text" bind:value={text} autocomplete="off" placeholder="filter">
    <label bind:this={filter} class="search-label" for="search" draggable="false">
		<button type="button" class="button-filter" onkeypress={(evt) => press(evt, evt.currentTarget)}>
        	<img src={filterImage} id="image" alt="" draggable="false">
		</button>
    </label>
</div>

<style>

    .search-bar {
		width: 100%;
		height: 10%;
		border-bottom: 1px solid var(--primary-color);
		display: flex;
		justify-content: center;
		align-items: center;

		.search-label, .sort-label {
			position: absolute;
			right: 0;
			width: 8%;
			cursor: pointer;
			display: flex;
			justify-content: space-around;
			align-items: center;
			transform: scale(1);
			transition: transform 0.4s;

			&:hover{
				transform: scale(1.4);
			}
		}

		.button-sort, .button-filter{
			pointer-events: none;
			background: transparent;
			border: none;
		}

		.sort-label{
			width: 8%;
			left: 0;
		}

		.sort-method {
			position: absolute;
			height: 15%;
			width: 20%;
			left: 0;
			padding: 2%;
			border: .15vw solid white;
			transform: translate(-100%, 0);
			border-radius: 20px;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 10px;
			background: var(--content-shadow-color);
			visibility: hidden;
			opacity: 0;
			scale: 0;
			transition: ease all .4s, transform .4s, width 0s, opacity .2s;

			button{
				font-family: 'Courier New', Courier, monospace;
				font-size: .8em;
				width: 100%;
				height: 60%;
				background: none;
				background: light-dark(rgba(255, 255, 255, .8), transparent);
				border: 1px solid var(--primary-color);
				border-radius: 20px;
				scale:1;
				cursor: pointer;
				transition: scale 0.3s;

				&:hover{
					scale: 1.1;
				}
			}
		}

		#search{
			display: none;

			&:checked ~ #text{
				visibility: visible;
				opacity: 1;
				padding: 2%;
			}
		}

		#sort{
			display: none;

			&:checked ~ .sort-method {
				visibility: visible;
				opacity: 1;
				transform: translate(-110%, 70%);
				scale: 1;
			}
		}

		#text{
			width: 60%;
			height: 70%;
			background: var(--content-shadow-color);
			outline:none;
			border-radius: 20px;
			font-family: 'Courier New', Courier, monospace;
			font-size: 1em;
			text-align: center;
			visibility: hidden;
			opacity: 0;
			border: 1px solid var(--primary-color);
			transition: opacity 0.4s, width .4s, visibility .4s;

			&::placeholder {
				text-align: center;
				font-size: 1em;
				color: var(--primary-color);
			}

			&:focus{
				
				width: 80%;

				&::placeholder {
					color:transparent;
				}
			}
		}
	}

    @media only screen and (max-height: 640px), only screen and (max-width: 695px) {

		.search-bar {
			margin-top: 8dvh;
			border: none;
			width: 0;
			height: 0;
			
			/* TODO: Layout SORT */
			.search-label {
				display: none;
			}
			
			.sort-label{
				
				display: flex;
				justify-content: center;
				left: 0;
				z-index: 1;
				bottom: 0;
				width: 7dvh;

				svg{
					fill: light-dark(rgba(0,0,0,0.5), rgba(255,255,255,0.7));
					width: 100%;
					height: 100%;
				}
				
				.button-sort{
					width: 5dvh;
					height: 6.5dvh;
					display: flex;
					align-items: center;
				}
				
				&:hover{
					transform: scale(1.1);
				}

				@media only screen and (max-device-width: 950px) and (max-device-height: 430px) and (orientation:landscape){
					width: 8vw;
					.button-sort{
						width: 8dvh;
						height: 10dvh;
					}
				}

				&:hover{
					transform: none;
				}
			}

			.sort-method{
				bottom: 0;
				padding: unset;
				transform: translate(0%, 0%);
				justify-content: center;
				flex-direction: row;
				background: transparent;
				width: 100vw;
				height: 6.5dvh;
				gap: 1dvh;
				border: none;
				scale: 1;
				opacity: 0;
				transition: transform 0.4s, opacity 0.4s, visibility 0.4s;

				button {
					width: 30%;
					height: 65%;
					font-size: 2.6dvh;
					border: .2dvh solid var(--primary-color);
					border-radius: 4dvh;

					&:hover{
						scale: 1.02;
					}

				}

				@media only screen and (max-device-width: 950px) and (max-device-height: 430px) and (orientation:landscape){
					height: 10.5dvh;
					
					button{
						font-size: 5dvh;
					}
				}
			}

			#sort{
				display: none;

				&:checked ~ .sort-method {
					visibility: visible;
					opacity: 1;
					transform: translate(0%, 0%);
				}

				&:checked ~ #text{
					transform: translateX(-100%);
					opacity: 0;
				}

				&:checked ~ .sort-label{
					svg{
						fill: rgba(255,255,255,0.7);
					}
				}
			}

			#search{
				&:checked ~ #text{
					padding: 0;
				}
			}

			#text {
				visibility: visible;
				opacity: 1;
				position: fixed;
				background: light-dark(rgba(255, 255, 255, .5), rgba(0, 0, 0, 0.4));
				bottom: 0;
				border: none;
				width: 100vw;
				height: 6dvh;
				border-radius: 0;
				font-size: 3dvh;
				transform: translateY(0%);
				transition: none;
				transition: opacity 1s, transform 1s, background 0.4s;

				&:focus{
					width: 100vw;
					outline:none;
					border-top: .5dvh solid rgb(232, 167, 44);
				}

				@media only screen and (max-device-width: 950px) and (max-device-height: 430px) and (orientation:landscape){
					height: 10dvh;
					font-size: 2.5vw;
				}
			}
		}
    }
</style>