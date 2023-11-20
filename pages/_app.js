import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import MiniDrawer from '@/components/MiniDrawer';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const excludedRoutes = ['/', '/login', '/restore',];
  const isExcludedRoute = excludedRoutes.includes(router.pathname);

  if (isExcludedRoute) {
    // Si es la página de inicio, no mostrar el MiniDrawer
    return (
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <Component {...pageProps} />
      </SessionProvider>
    );
  }

  // Mostrar el MiniDrawer en todas las demás páginas
  return (
    <SessionProvider session={pageProps.session} refetchInterval={0}>
      <MiniDrawer>
        <Component {...pageProps} />
      </MiniDrawer>
    </SessionProvider>
  );
}

