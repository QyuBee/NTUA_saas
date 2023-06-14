import AccountPage from './account'
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import  Header  from './static/header';

export default function NewUserPage() {
    const requestDB = [];
    const { data, status } = useSession();
    const router = useRouter();

    if (status === 'loading') return <h1> loading... please wait</h1>;
    if (requestDB.length == 1) {

        return (
            <div>
                <Header></Header>
                <AccountPage></AccountPage>
            </div>
        );

    } else if (requestDB.length == 0) {

        const createUser = (email) => {
            //Insert into database
        }

        return (
            <div>
                <Header></Header>
                <p>This is the first time you are logging with {data.user.email}</p>
                <p>if you continue, your email will be stored in our user database to allow you store your created chartsand purchase chart credits</p>
                <button onClick={() => {createUser(data.user.email); router.push('/account')}}>continue</button>
                <button onClick={() => { router.push('/index'); }}>no, thanks</button>
            </div>
        );

    }
}

