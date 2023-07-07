
const handler = async (req, res) => {
    if(!["bar","pie","line"].includes(req.body.type))
    {
        res.status(400).end();
    }
    const filename = req.body.type+"-chart.csv"

    console.log(`${process.cwd()}/public/templates/${filename}`)
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