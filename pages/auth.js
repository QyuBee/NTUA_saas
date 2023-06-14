import  Header  from './static/header';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function SignIn() {
    const { status } = useSession();
    if (status === 'loading') return <h1> loading... please wait</h1>;
    
    return (
    <div>
        <button onClick={() => signIn('google',  { callbackUrl: './newuser' })}>sign in with gooogle</button>
    </div>
    );
}


export default function SignOut() {
        
    return (
        <button onClick={signOut}>sign out</button>
    );
}

