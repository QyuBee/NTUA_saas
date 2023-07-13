import { getUser } from '@/lib/db';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
    const session = await getSession({ req });

    if (!session) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    if (req.method === 'GET') {
        // Process a POST request
        const user = await getUser(session.user.email);

        if (user instanceof Error) {
            console.error("Une erreur s'est produite :", user);
            res.status(500).end();
        } else {
            user.setLastConnection()
            res.status(200).end();
        }

    } else {
        // Handle any other HTTP method
        res.redirect(307, '/')
    }
}