import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Header from './static/header';
import { Button, Container, Group, LoadingOverlay } from '@mantine/core';

    const [loading, setLoading] = useState(false)

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
    const { status } = useSession();
    const router = useRouter();

    let Page;

    if (status === "authenticated") {
        userDB = JSON.parse(userDB)
        Page = (<div>
            <p>Email : {userDB.email}</p>
            <p>Credits : {userDB.credits}</p>
            <p>lastConnection : {userDB.lastConnection}</p>

            <Group>
                <Button onClick={() => { router.push('/mycharts'); }}>my charts</Button>
                <Button onClick={() => { router.push('/createnewchart'); }}>new chart</Button>
                <Button onClick={() => { router.push('/credits'); }}>buy credits</Button>
            </Group>

        </div>)
    }

    return (
        <div>
            <Header></Header>
            <LoadingOverlay visible={userDB==null || loading ?  true : false} overlayBlur={2} />;
            <Container>
                <h1>Account</h1>
                {status === "authenticated" && Page}
            </Container>

        </div>
    );



}
