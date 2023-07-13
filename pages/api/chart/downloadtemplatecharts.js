import { getSession } from 'next-auth/react';
import { csvJSON } from './utils';

function readFileAsync(path) {
  let fs = require('fs');
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

const handler = async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  let path = ""
  switch (req.query.type) {
    case "pie":
      path = "public/templates/pie-chart.csv"
      break;
    case "bar":
      path = "public/templates/bar-chart.csv"
      break;
    case "line":
      path = "public/templates/line-chart.csv"
      // console.log(path)
      break;
    default:
      break;
  }


  const contents = await readFileAsync(path);
  const template = csvJSON(contents);


  // contents is a string with the content of uploaded file, so you can read it or store


  const input = JSON.parse(template)
  if (typeof input.data == "string") { //With router in some case (refresh), it might be a string and in other an Object
    input.data = JSON.parse(input.data)
  }

  const options = {
    chart: {
      type: input.type
    },
    title: {
      text: input.title,
      align: 'left'
    },
    series: [{
      name: input.x_axe[0],
      colorByPoint: true,
      data: input.data.map(({ name, data }) => { return { name: name, y: parseFloat(data) } })
    }]
  }
  if (input.type == "pie") {
    options.series = [{
      name: input.x_axe[0],
      colorByPoint: true,
      data: input.data.map(({ name, data }) => { return { name: name, y: parseFloat(data) } })
    }]
    options.tooltip = {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    }
    options.accessibility = {
      point: {
        valueSuffix: '%'
      }
    }
    options.plotOptions = {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        }
      }
    }
  } else if (input.type == "bar") {
    options.xAxis = {
      categories: input.x_axe
    }
    options.yAxis = {
      min: 0,
      title: {
        text: input.y_axe,
        align: 'high'
      },
      labels: {
        overflow: 'justify'
      },
      gridLineWidth: 0
    }

    options.series = input.data
  }

  else if (input.type == "line") {
    options.yAxis = {
      title: {
        text: input.y_axe
      }
    }


    options.xAxis = {
      categories: input.x_axe
    }

    options.series = input.data


    options.plotOptions = {
      series: {
        label: {
          connectorAllowed: false
        },
        pointStart: 2010
      }
    }

    options.legend = {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle'
    }

    options.responsive = {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    }
  }


    res
      .status(200).json(options);
};

export default handler;
