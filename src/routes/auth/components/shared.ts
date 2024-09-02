import type { ActionData } from "../$types";

export function timeoutError(form: ActionData, timeout: boolean){
    if(form?.error && form?.error.submitter != "" && !timeout){
        setTimeout(() => {
            timeout=false;
            if(form)
                form.error = ""
        }, 5000);
        timeout = true;
    }
}