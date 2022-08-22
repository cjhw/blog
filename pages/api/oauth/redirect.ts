import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import request from 'service/fetch';
import { setCookie } from 'utils/index';
import { getDataBaseConnection } from 'db/index';
import { User, UserAuth } from 'db/entity/index';
import { userAgent } from 'next/server';

export default withIronSessionApiRoute(redirect, ironOptions);

// client-id 77eead5355dbfbf0c7d1
// client-secret ba43befe75ee0e34830f4e343d8e799c135a7b82

async function redirect(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  // http://localhost:3000/api/oauth/redirect?code=xxxxx
  const { code } = req?.query || {};
  const githubClientID = '77eead5355dbfbf0c7d1';
  const githubSecrect = 'ba43befe75ee0e34830f4e343d8e799c135a7b82';
  const url = `https://github.com/login/oauth/access_token?client_id=${githubClientID}&client_secret=${githubSecrect}&code=${code}`;

  const result = await request.post(
    url,
    {},
    {
      headers: {
        accept: 'application/json',
      },
    }
  );

  const { access_token } = result as any;

  const githubUserInfo = await request.get('https://api.github.com/user', {
    headers: {
      accept: 'application/json',
      Authorization: `token ${access_token}`,
    },
  });

  const cookies = Cookie.fromApiRoute(req, res);
  const db = await getDataBaseConnection()
  const userAuth = await db.getRepository(UserAuth).findOne({
    where: {
      identity_type: 'github',
      identifier: githubClientID,
    },
    relations: ["user"]
  });

  if (userAuth) {
    // 之前登录过的用户，直接从 user 里面获取用户信息，并且更新 credential
    const user = userAuth.user;
    const { id, nickname, avatar } = user;

    console.log(user);

    userAuth.credential = access_token;

    session.userId = id;
    session.nickname = nickname;
    session.avatar = avatar;

    await session.save();

    setCookie(cookies, { id, nickname, avatar });

    res.writeHead(302, {
      Location: '/',
    });
  } else {
    // 创建一个新用户，包括 user 和 user_auth
    const { login = '', avatar_url = '' } = githubUserInfo as any;
    const user = new User();
    user.nickname = login;
    user.avatar = avatar_url;

    const userAuth = new UserAuth();
    userAuth.identity_type = 'github';
    userAuth.identifier = githubClientID;
    userAuth.credential = access_token;
    userAuth.user = user;

    const userAuthRepo = db.getRepository(UserAuth);
    const resUserAuth = await userAuthRepo.save(userAuth);

    console.log(resUserAuth);

    const { id, nickname, avatar } = resUserAuth?.user || {};
    session.userId = id;
    session.nickname = nickname;
    session.avatar = avatar;

    await session.save();

    setCookie(cookies, { id, nickname, avatar });

    res.writeHead(302, {
      Location: '/',
    });
  }
}
