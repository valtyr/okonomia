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

    const png = await sharp(file.path)
      .resize(350, 450, {
        position: sharp.strategy.attention,
      })
      .png({
        compressionLevel: 9,
        colors: 128,
        force: true,
      })
      .toBuffer();

    const jpeg = await sharp(file.path)
      .resize(350, 450, {
        position: sharp.strategy.attention,
      })
      .jpeg({ mozjpeg: true })
      .toBuffer();

    const concat = new Uint8Array(png.byteLength + jpeg.byteLength);
    concat.set(new Uint8Array(png), 0);
    concat.set(new Uint8Array(jpeg), png.byteLength);

    if (!process.env.API_URL) {
      throw new Error('API_URL not set!');
    }

    const path = `${process.env.API_URL}/dp/upload`;

    const cfResponse = await fetch(path, {
      body: concat,
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpconcat',
        'X-PNG-Length': String(png.byteLength),
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
