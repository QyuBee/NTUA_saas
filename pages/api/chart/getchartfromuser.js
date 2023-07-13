import { getChartsFromUser } from '@/lib/db';
import { getSession } from 'next-auth/react';

const handler = async (req, res) => {
    const session = await getSession({ req });

    if (!session) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }


    // console.log("req.data",req.query)
    const charts = await getChartsFromUser(session.user.email)

    // console.log(charts)

    try {
        res.status(200).send(charts);
    } catch (error) {
        console.log(error)

        res.status(400).json({ error });
    }
};

export default handler;