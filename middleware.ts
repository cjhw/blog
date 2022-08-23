import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATH = /\.(.*)$/;

export function middleware(req: NextRequest) {
  // return NextResponse?.redirect(new URL('/user/9', req.url));
  // 1. 上报日志
  if (!PUBLIC_PATH.test(req?.nextUrl?.pathname)) {
    console.log(
      1111111111111111111111111111111111111111111111111111111111111111111111111111111111
    );
    // console.log(req.nextUrl.href);
    // console.log(req.referrer);
    // console.log(req.ua);
    // console.log(req.geo);
    // 接口上报
  }

  // 2. 重定向
  if (req?.nextUrl?.pathname === '/tag') {
    // return NextResponse?.redirect('/user/2');
  }
}

export const config = {
  matcher: ['/article/:path*'],
};
