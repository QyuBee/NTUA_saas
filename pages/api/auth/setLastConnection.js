import { getUser } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Process a POST request
        const user = await getUser(req.body.email);
        
        if (user instanceof Error) {
            console.error("Une erreur s'est produite :", user);
            res.status(500).end(user.toString());
        } else{
            user.setLastConnection()    
            res.status(200).end(user.toString());
        }

    } else {
        // Handle any other HTTP method
        res.redirect(307, '/')
    }
}