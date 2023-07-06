import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Header from './static/header';
import { getUser } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions)
    
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    
    const userDB = await getUser(session.user.email)

    return {
        props: {
            userDB: JSON.stringify(userDB),
        },
    }
}

export default function AccountPage({ userDB }) {
    const requestDB = [];
    const { data, status } = useSession();
    const router = useRouter();

    let Page;
        
    if (status === "authenticated") {
        userDB=JSON.parse(userDB)
        Page = (<div>
            <p>Email : {userDB.email}</p>
            <p>Credits : {userDB.credits}</p>
            <p>lastConnection : {userDB.lastConnection}</p>

            <button onClick={() => { router.push('/mycharts'); }}>my charts</button>
            <button onClick={() => { router.push('/createnewchart'); }}>new chart</button>
            <button onClick={() => { router.push('/credits'); }}>buy credits</button>

        </div>)
    }

    return (
        <div>
            <Header></Header>
            <h1>Account</h1>
            {status === "authenticated" && Page}
        </div>
    );



}
