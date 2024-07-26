<script>
	import { authMethod } from "$lib/firebase/auth";
</script>

<input type="button" onclick={()=>authMethod('logout')} value="PIPPO">
