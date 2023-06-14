import  Header  from './static/header';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function MyChartsPage() {
    const { data,status } = useSession();
    const router = useRouter();

    if (status === 'loading') return <h1> loading... please wait</h1>;
    if (data === null) return router.push('/');;

    return (
        <div>
            <Header></Header>
            <p>{data.user.email}</p>
            <button onClick={() => { router.push('/account'); }}>account</button>
            <button onClick={() => {signOut({ callbackUrl: '/' })}}>sign out</button>
            

            <button onClick={() => { router.push('/aboutus'); }}>aboutus</button>
        </div>
    );


}
