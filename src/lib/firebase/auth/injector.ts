import { auth } from '../clientFirebaseConf';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, type UserCredential, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';

const provider = new GoogleAuthProvider();

interface AuthMethod {
    method(email?:string, password?: string): Promise<UserCredential | void>;
}

class LoginWithGoogle implements AuthMethod{
    method(): Promise<UserCredential> {
        return signInWithPopup(auth, provider);
    }
}

class SignInWithEmail implements AuthMethod{
    method(email:string, password:string): Promise<UserCredential> {
        return signInWithEmailAndPassword(auth, email, password);
    }
}

class SignUpWithEmail implements AuthMethod{
    async method(email:string, password:string): Promise<UserCredential> {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(result.user);
        return result;
    }
}

class ForgotPassword implements AuthMethod{
    async method(email:string): Promise<void> {
        return await sendPasswordResetEmail(auth, email);
    }
}

class LogOut implements AuthMethod{
    method(): Promise<void> {
        return signOut(auth);
    }
}

//Singleton
export class Injector {

    private constructor() {}
    private static injector: Injector = new Injector();

    private authMethod: AuthMethod | undefined;

    static getInjector(){
        return this.injector;
    }

    callInjector(type: string, email?:string, password?: string): AuthMethod {
        switch(type){
            case 'google':
                return new LoginWithGoogle();
            case 'signin':
                return new SignInWithEmail();
            case 'signup':
                return new SignUpWithEmail();
            case 'logout':
                return new LogOut();
            case 'forgotpassword':
                return new ForgotPassword();
            default:
                throw new Error('Authentication Error')
        }
    }
}