import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { accessToken, userRole, rememberUser } = await req.json();

  if (accessToken === undefined) {
    return NextResponse.json(
      {
        stored: false,
      },
      { status: 400 }
    );
  }

  const response = NextResponse.json(
    {
      stored: true,
    },
    { status: 200 }
  );

  response.cookies.delete('jwt');
  response.cookies.delete('role');

  const expiration = 24 * 60 * 60;

  response.cookies.set({
    name: 'jwt',
    value: accessToken !== undefined ? accessToken : '',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: rememberUser === true ? expiration * 180 : expiration,
  });

  response.cookies.set({
    name: 'role',
    value: userRole !== undefined ? userRole : '',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: rememberUser === true ? expiration * 180 : expiration,
  });

  return response;
}
