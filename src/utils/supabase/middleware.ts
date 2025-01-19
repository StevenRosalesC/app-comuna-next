import { auth } from '@/lib/auth';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/lib/env.config';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { UserProjectsWithProjects } from 'types';

export async function updateSession(request: NextRequest) {
  // let supabaseResponse = NextResponse.next({
  //   request
  // });

  // const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
  //   cookies: {
  //     getAll() {
  //       return request.cookies.getAll();
  //     },
  //     setAll(cookiesToSet) {
  //       cookiesToSet.forEach(({ name, value, options }) =>
  //         request.cookies.set(name, value)
  //       );
  //       supabaseResponse = NextResponse.next({
  //         request
  //       });
  //       cookiesToSet.forEach(({ name, value, options }) =>
  //         supabaseResponse.cookies.set(name, value, options)
  //       );
  //     }
  //   }
  // });

  // // Do not run code between createServerClient and
  // // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // // issues with users being randomly logged out.

  // // IMPORTANT: DO NOT REMOVE auth.getUser()
  // const {
  //   data: { user }
  // } = await supabase.auth.getUser();
  // if (!user && request.nextUrl.pathname !== '/home') {
  //   // no user, potentially respond by redirecting the user to the login page
  //   const url = request.nextUrl.clone();
  //   url.pathname = '/login';
  //   return NextResponse.redirect(url);
  // }
  // const userInfo = await auth();
  // if (request.nextUrl.pathname.includes('/dashboard/projects')) {
  //   // validate if the user has access to the project
  //   const projectSlug = request.nextUrl.pathname
  //     .split('/')
  //     .pop()
  //     ?.toUpperCase();
  //   const userProjects = userInfo?.user_projects as UserProjectsWithProjects[];
  //   const hasAccess = userProjects.some(
  //     (project) => project.projects.jira_key.trim() === projectSlug?.trim()
  //   );
  //   if (!hasAccess) {
  //     const url = request.nextUrl.clone();
  //     url.pathname = '/404';
  //     return NextResponse.redirect(url);
  //   }
  //   // if the user has access, update the session
  // }
  // // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // // If you're creating a new response object with NextResponse.next() make sure to:
  // // 1. Pass the request in it, like so:
  // //    const myNewResponse = NextResponse.next({ request })
  // // 2. Copy over the cookies, like so:
  // //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // // 3. Change the myNewResponse object to fit your needs, but avoid changing
  // //    the cookies!
  // // 4. Finally:
  // //    return myNewResponse
  // // If this is not done, you may be causing the browser and server to go out
  // // of sync and terminate the user's session prematurely!
  // if (request.nextUrl.pathname === '/home') {
  //   const url = request.nextUrl.clone();
  //   url.pathname = '/dashboard/overview';
  //   return NextResponse.redirect(url);
  // }
}
