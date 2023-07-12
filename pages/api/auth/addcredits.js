import { getUser } from '@/lib/db';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
    const session = await getSession({ req });

    if (!session) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    if (req.method === 'POST') {
        // Process a POST request
        const user = await getUser(session.user.email);

        // console.log(session.user.email,user)

        if (user instanceof Error) {
            console.error("Une erreur s'est produite :", user);
            res.status(500).end(user.toString());
        } else {
            user.addCredit(req.query.credits)
            res.status(200).end(user.toString());
        }

    } else {
        // Handle any other HTTP method
        res.redirect(307, '/')
    }
}