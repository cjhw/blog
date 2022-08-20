import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { ISession } from 'pages/api/index';
import { AppDataSource } from 'db';
import { User, UserAuth } from 'db/entity';

export default withIronSessionApiRoute(login, ironOptions);

async function login(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { phone = '', verify = '', identity_type = 'phone' } = req.body;
  const db = await AppDataSource.initialize();
  const userRepo = db.getRepository(User);
  const userAuthRepo = db.getRepository(UserAuth);
  const users = await userRepo.find();

  if (String(session.verifyCode) === String(verify)) {
    // 验证码正确，在 user_auths 表中查找 identity_type 是否有记录
    const userAuth = await userAuthRepo.findOne({
      where: {
        identity_type,
        identifier: phone,
      },
      relations: {
        user: true,
      },
    });

    if (userAuth) {
      // 已存在的用户
      const user = userAuth.user;
      const { id, nickname, avatar } = user;

      session.userId = id;
      session.nickname = nickname;
      session.avatar = avatar;

      await session.save();
      res?.status(200).json({
        code: 0,
        msg: '登录成功',
        data: {
          userId: id,
          nickname,
          avatar,
        },
      });
    } else {
      // 新用户，自动注册
      const user = new User();
      user.nickname = `用户_${Math.floor(Math.random() * 10000)}`;
      user.avatar = '/images/avatar.jpg';
      user.job = '暂无';
      user.introduce = '暂无';

      const userAuth = new UserAuth();
      userAuth.identifier = phone;
      userAuth.identity_type = identity_type;
      userAuth.credential = session.verifyCode;
      userAuth.user = user;

      const resUserAuth = await userAuthRepo.save(userAuth);
      console.log(resUserAuth);
      const {
        user: { id, nickname, avatar },
      } = resUserAuth;

      session.userId = id;
      session.nickname = nickname;
      session.avatar = avatar;

      await session.save();

      res?.status(200).json({
        code: 0,
        msg: '登录成功',
        data: {
          userId: id,
          nickname,
          avatar,
        },
      });
    }
  } else {
    res?.status(200).json({ code: -1, msg: '验证码错误' });
  }
}
