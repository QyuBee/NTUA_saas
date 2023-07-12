import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Header from './static/header';
import { getUser } from '@/lib/db';
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import { UserDB } from '@/lib/db_model';
import { Button, Container, Group, LoadingOverlay } from '@mantine/core';

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

export default function NewUserPage({ userDB }) {
    // TODO check come from account.google
    let { data, status, update } = useSession();
    const router = useRouter();
    let Page;

    if (status === 'loading') return <LoadingOverlay visible={true} overlayBlur={2} />;

    userDB = JSON.parse(userDB)

    if (userDB != null) {
        const user = new UserDB()
        user.init(userDB)
        // console.log(user)
        fetch('/api/auth/setLastConnection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(function (response) {
            // console.log(response.status); // Will show you the status
            if (response.status != 200 && response.status != 500) {
                console.error("HTTP status " + response.status);
            }
            else {
                router.push("/account")
            }

            // return response.json();
        })

    } else if (userDB == null) {
        return (
            <div>
                <Header></Header>
                <Container>

                    <p>This is the first time you are logging with {data.user.email}</p>
                    <p>if you continue, your email will be stored in our user database to allow you store your created chartsand purchase chart credits</p>
                    <Group>

                        <Button onClick={() => {
                            fetch('/api/auth/adduser', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            }).then(function (response) {
                                // console.log(response.status); // Will show you the status
                                if (response.status != 200 && response.status != 500) {
                                    console.error("HTTP status " + response.status);
                                }
                                else {
                                    router.push("/account")
                                }

                                // return response.json();
                            })
                        }}>continue</Button>
                        <Button onClick={signOut}>no, thanks</Button>
                    </Group>
                </Container>
            </div>
        );

    }

    return (
        <div>
            {/* <Header></Header> */}
            <h1>New User</h1>
            {status === "authenticated" && Page}
        </div>
    );

}

