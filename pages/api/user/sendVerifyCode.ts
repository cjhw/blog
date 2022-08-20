import { NextApiRequest, NextApiResponse } from 'next';
import { format } from 'date-fns';
import md5 from 'md5';
import { encode } from 'js-base64';
import request from 'service/fetch';

export default async function sendVerifyCode(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { to = '', templateId = '1' } = req.body;
  const AppId = '8aaf070882b3fb710182b56a48920084';
  const AccountId = '8aaf070882b3fb710182b56a477e007d';
  const AuthToken = '27782cb7c0cc4870beac08738f58319b';
  const NowDate = format(new Date(), 'yyyyMMddHHmmss');
  const SigParameter = md5(`${AccountId}${AuthToken}${NowDate}`);
  const Authorization = encode(`${AccountId}:${NowDate}`);
  const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  const expireMinute = '5';
  const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountId}/SMS/TemplateSMS?sig=${SigParameter}`;

  const response = await request.post(
    url,
    {
      to,
      templateId,
      appId: AppId,
      datas: [verifyCode, expireMinute],
    },
    {
      headers: {
        Authorization,
      },
    }
  );

  console.log(response);
}
