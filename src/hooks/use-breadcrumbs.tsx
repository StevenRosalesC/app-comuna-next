'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

// Translations dictionary for route segments fallback
const segmentTranslations: Record<string, string> = {
  dashboard: 'Panel',
  overview: 'Resumen',
  admin: 'Administrador',
  analytics: 'Analíticas',
  'annual-fee': 'Cuotas Anuales',
  'cash-management': 'Gestión de Caja',
  collections: 'Colectas Solidarias',
  funds: 'Fondos Comunitarios',
  history: 'Historial',
  members: 'Comuneros',
  persons: 'Personas',
  notices: 'Noticias',
  create: 'Crear',
  edit: 'Editar',
  preview: 'Vista Previa',
  'post-csr': 'Publicación CSR',
  'post-ssr': 'Publicación SSR',
  product: 'Productos',
  new: 'Nuevo',
  profile: 'Perfil',
  roles: 'Roles',
  users: 'Usuarios',
  auth: 'Autenticación',
  login: 'Iniciar Sesión',
  'forgot-password': 'Recuperar Contraseña',
  'reset-password': 'Restablecer Contraseña',
  unauthorized: 'No Autorizado',
  about: 'Acerca de',
  contact: 'Contacto',
  home: 'Inicio'
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  // Public pages
  '/': [{ title: 'Inicio', link: '/' }],
  '/home': [{ title: 'Inicio', link: '/home' }],
  '/about': [
    { title: 'Inicio', link: '/' },
    { title: 'Acerca de', link: '/about' }
  ],
  '/contact': [
    { title: 'Inicio', link: '/' },
    { title: 'Contacto', link: '/contact' }
  ],
  '/notices': [
    { title: 'Inicio', link: '/' },
    { title: 'Noticias', link: '/notices' }
  ],

  // Auth pages
  '/auth/login': [
    { title: 'Inicio', link: '/' },
    { title: 'Iniciar Sesión', link: '/auth/login' }
  ],
  '/auth/forgot-password': [
    { title: 'Inicio', link: '/' },
    { title: 'Recuperar Contraseña', link: '/auth/forgot-password' }
  ],

  // Unauthorized page
  '/unauthorized': [
    { title: 'Inicio', link: '/' },
    { title: 'No Autorizado', link: '/unauthorized' }
  ],

  // Dashboard pages
  '/dashboard': [{ title: 'Panel', link: '/dashboard' }],
  '/dashboard/overview': [
    { title: 'Panel', link: '/dashboard' },
    { title: 'Resumen', link: '/dashboard/overview' }
  ],
  '/dashboard/admin': [
    { title: 'Panel', link: '/dashboard' },
    { title: 'Administrador', link: '/dashboard/admin' }
  ],
  '/dashboard/analytics': [
    { title: 'Panel', link: '/dashboard' },
    { title: 'Analíticas', link: '/dashboard/analytics' }
  ],
  '/dashboard/annual-fee': [
    { title: 'Panel', link: '/dashboard' },
    { title: 'Cuotas Anuales', link: '/dashboard/annual-fee' }
  ],
  '/dashboard/cash-management': [
    { title: 'Panel', link: '/dashboard' },
    { title: 'Gestión de Caja', link: '/dashboard/cash-management' }
  ],
  '/dashboard/cash-management/history': [
    { title: 'Panel', link: '/dashboard' },
    { title: 'Gestión de Caja', link: '/dashboard/cash-management' },
    { title: 'Historial de Cajas', link: '/dashboard/cash-management/history' }
  ],
  '/dashboard/collections': [
    { title: 'Panel', link: '/dashboard' },
    { title: 'Colectas Solidarias', link: '/dashboard/collections' }
  ],
  '/dashboard/funds': [
    { title: 'Panel', link: '/dashboard' },
    { title: 'Fondos Comunitarios', link: '/dashboard/funds' }
  ],
  '/dashboard/members': [
    { title: 'Panel', link: '/dashboard' },
    { title: 'Comuneros', link: '/dashboard/members' }
  ],
  '/dashboard/persons': [
    { title: 'Panel', link: '/dashboard' },
    { title: 'Personas', link: '/dashboard/persons' }
  ],
  '/dashboard/notices': [
    { title: 'Panel', link: '/dashboard' },
    { title: 'Noticias', link: '/dashboard/notices' }
  ],
  '/dashboard/notices/create': [
    { title: 'Panel', link: '/dashboard' },
    { title: 'Noticias', link: '/dashboard/notices' },
    { title: 'Crear Noticia', link: '/dashboard/notices/create' }
  ],
  '/dashboard/notices/post-csr': [
    { title: 'Panel', link: '/dashboard' },
    { title: 'Noticias', link: '/dashboard/notices' },
    { title: 'Publicación CSR', link: '/dashboard/notices/post-csr' }
  ],
  '/dashboard/notices/post-ssr': [
    { title: 'Panel', link: '/dashboard' },
    { title: 'Noticias', link: '/dashboard/notices' },
    { title: 'Publicación SSR', link: '/dashboard/notices/post-ssr' }
  ],
  '/dashboard/product': [
    { title: 'Panel', link: '/dashboard' },
    { title: 'Productos', link: '/dashboard/product' }
  ],
  '/dashboard/product/new': [
    { title: 'Panel', link: '/dashboard' },
    { title: 'Productos', link: '/dashboard/product' },
    { title: 'Nuevo Producto', link: '/dashboard/product/new' }
  ],
  '/dashboard/profile': [
    { title: 'Panel', link: '/dashboard' },
    { title: 'Perfil', link: '/dashboard/profile' }
  ],
  '/dashboard/roles': [
    { title: 'Panel', link: '/dashboard' },
    { title: 'Roles', link: '/dashboard/roles' }
  ],
  '/dashboard/users': [
    { title: 'Panel', link: '/dashboard' },
    { title: 'Usuarios', link: '/dashboard/users' }
  ]
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      const title =
        segmentTranslations[segment] ||
        segment.charAt(0).toUpperCase() + segment.slice(1);
      return {
        title,
        link: path
      };
    });
  }, [pathname]);

  return breadcrumbs;
}
