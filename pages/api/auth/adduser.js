import { createUser } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Process a POST request
        const result = await createUser(req.body.email);
        
        if (result instanceof Error) {
            console.error("Une erreur s'est produite :", result);
            res.status(500).end(result.toString());
        } else{
            res.status(200).end(result.toString());
        }

    } else {
        // Handle any other HTTP method
        res.redirect(307, '/')
    }
}