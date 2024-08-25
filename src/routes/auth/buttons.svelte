<script lang="ts">
    import logo from '$lib/assets/google-logo.svg';
</script>

<div class="buttons">
    <div class="login">
        <a href="/auth/signin" draggable="false">Sign In</a>
    </div>
    <div class="google">
        <button type="submit" name="google" class="google-button">
            <img src={logo} id="google-logo" alt="" draggable="false">
        </button>
    </div>
    <div class="signup">
        <a href="/auth/signup" draggable="false">Sign Up</a>
    </div>
</div>

<style>
    .buttons {
        width: 100%;
        height: 5em;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .login,
    .signup {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        width: 100%;
        height: 100%;
        box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
        cursor: pointer;
        transition:
            scale 0.4s;
    
        a {
            text-decoration: none;
            font-size: 1.5em;
            text-wrap: nowrap;
        }
    
        &:hover {
            scale: 1.03;
        }
    }
    
    .login {
        background: var(--signin-backgound);
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
    
        a {
            color: var(--primary-color-reverse);
        }
    }
    
    .signup {
        background: var(--signup-backgound);
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
    
        a {
            color: var(--primary-color);
        }
    }

    .google {
        display:flex;
        align-items: center;
        background-color: var(--google-background);
        padding: 10px;
        transition: padding .4s;

        &:hover {
            padding-left: 20px;
            padding-right: 20px;
        }
    }

    .google-button{
        background: transparent;
        cursor: pointer;
        border: none;
    }

    #google-logo {
        position: relative;
        scale: 1.5;
        transition: scale .4s;

        &:hover {
            scale: 1.7;
        }
    }
    
    @media only screen and (max-height: 350px) {

        .buttons {
            flex-direction: column;
            justify-content: center;
        }

        .login, .signup, .google {
            display: flex;
            justify-content: center;
            width: 20vw;
            height: 5vw;
            border-radius: 20px;

            a {
                font-size: 3vw;
            }
        }

        .google {
            width: fit-content;
            height: fit-content;
            padding: unset;
            margin: 10px;
            border-radius: 0;
            background-color: transparent;

            &:hover {
                padding-left: 10vw;
                padding-right: 10vw;
            }
        }

        #google-logo {
            z-index: 1;
            scale: 1;

            &:hover {
                scale: 1.2;
            }
        }
    }

</style>