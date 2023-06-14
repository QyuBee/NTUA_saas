import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

function Nav() {
    const router = useRouter();

    return (
        <div>
            <button onClick={() => { router.push('/index'); }}>index</button>
            <button onClick={() => { router.push('/account'); }}>account</button>
            <button onClick={() => { router.push('/mycharts'); }}>mycharts</button>
            <button onClick={() => { router.push('/aboutus'); }}>aboutus</button>
{/* 
            <button onClick={() => { router.push('/credits'); }}>credits</button>
 <button onClick={() => { router.push('/createnewchart'); }}>createnewchart</button>
 */}
        </div>
    )
}

export default function Header() {
    const router = useRouter();
    const { data, status } = useSession();
    if (status === 'loading') return <h1> loading... please wait</h1>;
    if (status === 'authenticated') {
        return (
            <div>
                <p> hi {data.user.name}</p>
                <img src={data.user.image} alt={data.user.name + ' photo'} />
                <br></br>
                <button onClick={signOut}>sign out</button>
                <Nav></Nav>
            </div>
        );
    }
    return (
        <div>
            <button onClick={() => signIn('google', { callbackUrl: "/newuser" })}>sign in with gooogle</button>
            <Nav></Nav>
        </div>
    );
}

