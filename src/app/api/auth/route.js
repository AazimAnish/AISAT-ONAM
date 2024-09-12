// app/api/auth/route.js
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const data = await request.json();
    const { token } = data;

    if (!token) {
      return new Response(JSON.stringify({ error: 'Token is required' }), { status: 400 });
    }

    const cookiesStore = cookies();
    cookiesStore.set('sys_bio', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return new Response(JSON.stringify({ status: 'Cookie set successfully' }), { status: 200 });
  } catch (error) {

    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}