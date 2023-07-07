import { IncomingForm } from 'formidable'
// you might want to use regular 'fs' and not a promise one
import { promises as fs } from 'fs'
import { csvJSON } from './utils';

// first we need to disable the default body parser
export const config = {
    api: {
        bodyParser: false,
    }
};

export default async (req, res) => {
    // parse form with a Promise wrapper
    const data = await new Promise((resolve, reject) => {
        const form = new IncomingForm()

        form.parse(req, (err, fields, files) => {
            if (err) return reject(err)
            resolve({ fields, files })
        })
    })

    // console.log(data.files)

    // read file from the temporary path
    const contents = await fs.readFile(data?.files?.myfile[0].filepath, {
        encoding: 'utf8',
    })
    // contents is a string with the content of uploaded file, so you can read it or store
    try {
        const result = csvJSON(contents)
        res.status(200).end(result)
    } catch (error) {
        console.error(error)
        res.status(500).send(error.toString());
    }
}