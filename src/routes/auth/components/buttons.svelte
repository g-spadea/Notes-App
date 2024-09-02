<script lang="ts">
    import logo from '$lib/assets/google-logo.svg';
    import './button.css';
</script>

<div class="buttons">
    <div class="login">
        <a href="/auth/signin" draggable="false" data-sveltekit-reload>Sign In</a>
    </div>
    <div class="google">
        <button title="Login with google" type="submit" name="google" class="google-button">
            <img src={logo} id="google-logo" alt="Google logo for sign in with google account" draggable="false">
        </button>
    </div>
    <div class="signup">
        <a href="/auth/signup" draggable="false" data-sveltekit-reload>Sign Up</a>
    </div>
</div>