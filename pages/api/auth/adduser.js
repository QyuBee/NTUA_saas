import { createUser } from '@/lib/db';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
    const session = await getSession({ req });

    if (!session) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    if (req.method === 'GET') {
        // Process a POST request
        const result = await createUser(session.user.email);

        if (result instanceof Error) {
            console.error("Une erreur s'est produite :", result);
            res.status(500).end(result.toString());
        } else {
            res.status(200).end(result.toString());
        }

    } else {
        // Handle any other HTTP method
        res.redirect(307, '/')
    }
}