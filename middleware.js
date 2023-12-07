import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export  async function middleware(request) {
    // Verificar que el usuario esté autenticado  
    const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    console.log(session);

    // Estraer la ruta que se estaba visualizando 
    if (!session ) {
      return NextResponse.redirect(`https://web-service-production-584c.up.railway.app/login`)
    }
    
    // Si está autenticado, continuar con la petición
    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/home/:path*',
    '/users',
    '/orders',
    '/devices',
    '/components',
    '/homeEmployee',
    '/ordersEmployee',
    '/devicesEmployee',
    '/componentsEmployee'
  ]
} 
