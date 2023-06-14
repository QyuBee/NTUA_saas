import Header from './static/header';
import AccountPage from './account'
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function CreditPage() {
    const requestDB = [];
    const { data, status } = useSession();
    const router = useRouter();

    if (status === 'loading') return <h1> loading... please wait</h1>;

    const ButtonCredit = (props) => {
        
        return(
            <button onClick={() => {
                //Insert into database

                router.push('/account')
            }}>{props.number} credits</button>
        )
    }

    return (
        <div>
            <Header></Header>
            <p>This is the first time you are logging with {data.user.email}</p>
            <ButtonCredit number={5} />
            <ButtonCredit number={10} />
            <ButtonCredit number={20} />
            <ButtonCredit number={50} />
        </div>
    );

}

