import { getSession } from 'next-auth/react';

const handler = async (req, res) => {  
  const session = await getSession({ req });

  if (!session) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
  }

    if(!["bar","pie","line"].includes(req.query.type))
    {
        res.status(400).end();
    }
    const filename = req.query.type+"-chart.csv"

    // console.log(`${process.cwd()}/public/templates/${filename}`)
    try {
        let fs = require('fs');
        const csvFile = fs.createReadStream(`${process.cwd()}/public/templates/${filename}`);
        // console.log(csvFile)
        res
          .status(200)
          .setHeader("Content-Type", "text/csv")
          .setHeader("Content-Disposition", `attachment; filename=${filename}`)
          .send(csvFile);
      } catch (error) {
        console.log(error)

        res.status(400).json({ error });
      }
};

export default handler;