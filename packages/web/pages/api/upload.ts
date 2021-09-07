import type { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import formidable from 'formidable';

const getFiles = (req: NextApiRequest): Promise<formidable.Files> =>
  new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });

    form.parse(req, (err, _fields, files) => {
      if (err) reject(err);
      resolve(files);
    });
  });

const uploadRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const files = await getFiles(req);

  if (!files.file) {
    res.status(400).json({ error: 'Invalid request' });
    return;
  }

  try {
    const file = files.file as formidable.File;

    if (!file.type?.startsWith('image/')) {
      res.status(400).json({ error: 'Invalid request' });
      return;
    }

    const compressed = await sharp(file.path)
      .resize(350, 450, {
        position: sharp.strategy.attention,
      })
      .jpeg({ mozjpeg: true })
      .toBuffer();

    const cfResponse = await fetch('http://localhost:8787/api/dp/upload', {
      body: compressed,
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpeg',
      },
    }).then((r) => r.json());

    res.status(200).json(cfResponse);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error occurred' });
    return;
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default uploadRoute;
