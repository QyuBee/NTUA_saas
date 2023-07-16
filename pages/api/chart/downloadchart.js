import { getChartsFromId } from '@/lib/db';
import { getSession } from 'next-auth/react';

const handler = async (req, res) => {

  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // console.log("req.data",req.query)
  const chart = await getChartsFromId(req.query.chart_id)

  if (chart.user_id != session.user.email) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const file = getFile(chart,req.query.type)
    res
      .status(200)
      // .setHeader("Content-Type", "text/csv")
      .setHeader("Content-Disposition", `attachment; filename=${chart.name}.${req.query.type}`)
      .send(file);
  } catch (error) {
    console.log(error)

    res.status(400).json({ error });
  }
};

function getFile(chart,type){
  let path = ""
  switch (type) {
    case "html":
      path = chart.path_html
      break;
    case "png":
      path = chart.path_png
      break;
    case "pdf":
      path = chart.path_pdf
      break;
    case "svg":
      path = chart.path_svg
      break;
    default:
      break;
  }
  // console.log(req.query.type=="pdf")

    let fs = require('fs');
    const file = fs.createReadStream(path);
    // console.log(file.path)
    return file
}

export default handler;