import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const response = NextResponse.json(
    {
      removed: true,
    },
    { status: 200 }
  );

  response.cookies.delete('jwt');
  response.cookies.delete('role');

  return response;
}
