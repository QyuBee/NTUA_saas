import AccountPage from './account'
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Header from './static/header';
import { createUser, getUser } from '@/lib/db';
// import withSession from '../lib/session'

/* export const getServerSideProps = withSession(async function ({ req, res }) {
    console.log("req",req)
    const { user } = req.session
   
    const userDB = getUser(user.email) 
   
    return {
      props: { userDB },
    }
  }) */

import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import { cpSync } from 'fs';
import { UserDB } from '@/lib/db_model';

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
    const user=new UserDB()
    user.init(JSON.parse(userDB))

    if (status === 'loading') return <h1> loading... please wait</h1>;

    if (user != null) {
        // console.log(user)
        fetch('/api/auth/setLastConnection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email:data.user.email}),
        }).then(function(response) {
            // console.log(response.status); // Will show you the status
            if (response.status!=200 && response.status!=500) {
                console.error("HTTP status " + response.status);
            }
            else{
                router.push("/account")
            }

            // return response.json();
        })

    } else if (user == null) {
        return (
            <div>
                <Header></Header>
                <p>This is the first time you are logging with {data.user.email}</p>
                <p>if you continue, your email will be stored in our user database to allow you store your created chartsand purchase chart credits</p>
                <button onClick={() => {
                    fetch('/api/auth/adduser', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({email:data.user.email}),
                    }).then(function(response) {
                        // console.log(response.status); // Will show you the status
                        if (response.status!=200 && response.status!=500) {
                            console.error("HTTP status " + response.status);
                        }
                        else{
                            router.push("/account")
                        }

                        // return response.json();
                    })
                }}>continue</button>
                <button onClick={() => { router.push('/'); }}>no, thanks</button>
            </div>
        );

    }

    return (
        <div>
            <Header></Header>
            <h1>New User</h1>
            {status === "authenticated" && Page}
        </div>
    );

}

