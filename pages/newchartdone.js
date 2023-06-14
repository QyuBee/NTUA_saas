import  Header  from './static/header';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function NewChartDonePage() {
    const { data,status } = useSession();
    const router = useRouter();

    if (status === 'loading') return <h1> loading... please wait</h1>;
    if (data === null) return router.push('/');;

    return (
        <div>
            <Header></Header>
            <p>{data.user.email}</p>
            <button onClick={() => { 
                //Insert db
                router.push('/mycharts');
                 }}>save to my chart</button>            

            <button onClick={() => { router.push('/createnewchart'); }}>discard</button>
        </div>
    );


}
