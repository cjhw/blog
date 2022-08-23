import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { getDataBaseConnection } from 'db/index';
import { Article } from 'db/entity/index';

export default withIronSessionApiRoute(get, ironOptions);

async function get(req: NextApiRequest, res: NextApiResponse) {
  const { tag_id = 0 } = req?.query || {};
  const db = await getDataBaseConnection();
  const articleRepo = db.getRepository(Article);

  let articles = [];

  if (tag_id) {
    articles = await articleRepo.find({
      relations: ['user', 'tags'],
      where: {
        tags: {
          id: Number(tag_id),
        },
      },
    });
  } else {
    articles = await articleRepo.find({
      relations: ['user', 'tags'],
    });
  }

  res?.status(200).json({
    code: 0,
    msg: '',
    data: articles || [],
  });
}
