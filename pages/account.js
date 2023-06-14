import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import  Header  from './static/header';

export default function AccountPage() {
    const requestDB = [];
    const { status } = useSession();
    const router = useRouter();

    if (status === 'loading') return <h1> loading... please wait</h1>;

    return (
        <div>
            <Header></Header>
            <button onClick={() => { router.push('/mycharts'); }}>my charts</button>
            <button onClick={() => { router.push('/createnewchart'); }}>new chart</button>
            <button onClick={() => { router.push('/credits'); }}>buy credits</button>

        </div>
    );


}
