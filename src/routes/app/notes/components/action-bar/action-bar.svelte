<script lang="ts">
    import filterImage from "$lib/assets/filter.svg"
	import './action-bar.css';

	let {sortMethod=$bindable()} : {
		sortMethod: HTMLButtonElement| undefined
	} = $props();

    let text: string = $state('');
    let notes: NodeListOf<HTMLElement> = $state()!;
	let observer: MutationObserver;
	let filterCheckbox: boolean | undefined = $state();
	
	let sort: HTMLLabelElement, filter: HTMLLabelElement;
	let dateSort: HTMLButtonElement;
	let nameSort: HTMLButtonElement;

	function pressOnLabel(evt: KeyboardEvent, target: HTMLButtonElement){
		evt.code === "Enter" || evt.code === "Space" ? target.parentElement!.click() : evt.stopPropagation();
	}

	function filterNotes(notes: NodeListOf<HTMLElement>, text: string){
		for(let note=0; note < notes.length; note++){
			if(note == 0) continue;
			const noteName = notes[note].id;
			
			if(text.length > noteName.length) {
				notes[note].style.display='none';
				continue;
			}
			
			if(noteName.slice(0, text.length) === text || text === '')
				notes[note].style.display='';
			else
				notes[note].style.display='none';
		}
	}

	function changeSortMethod(method:HTMLButtonElement){
		switch(method){
			case dateSort:
				localStorage.setItem('sort', 'Date');
				break;
			case nameSort:
				localStorage.setItem('sort', 'Name')
				break;
			default:
				return;
		}
		
		sortMethod = method;
	}

	function observeNotesChange(){
		observer = new MutationObserver(() => {
			notes = document.querySelectorAll('.note');
		});

		observer.observe(document.querySelector('.notes')!, { 
			attributes: true, 
			childList: true, 
			subtree: true
		});
	}

	function selectSortMethod(){
		
		if(!sortMethod){
			const item = localStorage.getItem('sort');
			switch(item){
				case 'Date':
					sortMethod = dateSort;
					break;
				case 'Name':
					sortMethod = nameSort;
					break;
				default:
					sortMethod = dateSort;
					localStorage.setItem('sort', 'Date')
			}
		}

		//Highlight sort method selected
		if(sortMethod === dateSort){
			dateSort.style.background = 'light-dark(rgba(255, 115, 1, 0.631),rgba(255, 106, 0, 0.335))'
			nameSort.style.background = 'inherit'
		}
		else {
			nameSort.style.background = 'light-dark(rgba(255, 115, 1, 0.631),rgba(255, 106, 0, 0.335))'
			dateSort.style.background = 'inherit'
		}

	}
	
	$effect(() => {
		
		if(!observer)
			observeNotesChange();

		selectSortMethod();
			
		if(!notes) notes = document.querySelectorAll('.note');
		if(!filterCheckbox) text = '';

		filterNotes(notes, text);

	})
</script>

<div class="search-bar">
    
	<!-- Hidden checkbox -->
	<input id="sort" type="checkbox">
	<input id="search" type="checkbox" bind:checked={filterCheckbox}>
    
	<div class="sort-method">
		<button 
			bind:this={dateSort} 
			type="button" 
			onclick={() => changeSortMethod(dateSort)}>
			Date
		</button>

        <button 
			bind:this={nameSort}
			type="button"
			onclick={() => changeSortMethod(nameSort)}>
			Name
		</button>
    </div>

	<label 
		bind:this={sort} 
		class="sort-label" 
		for="sort" 
		title="Sort method for notes"
		draggable="false">

		<button 
			class="button-sort"
			type="button" 
			aria-label="sort" 
			onkeypress={(evt) => pressOnLabel(evt, evt.currentTarget)}>

			<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
				<path d="M120-240v-80h240v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Z"/>
			</svg>
		</button>
	</label>

    <input id="text" type="text" bind:value={text} autocomplete="off" placeholder="filter">
    
	<label
		bind:this={filter}
		class="search-label"
		for="search"
		title="Filter for notes"
		draggable="false">

		<button 
			type="button" 
			class="button-filter" 
			onkeypress={(evt) => pressOnLabel(evt, evt.currentTarget)}>
        	<img src={filterImage} id="image" alt="A filter to select specific note" draggable="false">
		</button>
    </label>

</div>