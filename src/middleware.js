import { NextResponse } from 'next/server';

function decodeBase64(base64String) {
    try {
        return Buffer.from(base64String, 'base64').toString('utf-8');
    } catch (error) {
        console.error('Error decoding Base64 string:', error);
        return null;
    }
}

export function middleware(request) {
    console.log("Middleware called");

    // Get the full URL and pathname
    const fullUrl = new URL(request.url);
    const pathname = fullUrl.pathname;
    console.log("URL: ", fullUrl.toString());
    console.log("Pathname: ", pathname);

    // Get the 'sys_bio' cookie from the request headers
    let cookie = request.cookies.get('sys_bio');
    console.log("Cookies: ", cookie);

    // Check if the cookie is not found and the request is not for the root path
    if (!cookie && pathname !== "/" && pathname !== "/register") {
        console.error("Cookies not found, redirecting to /");
        return NextResponse.redirect(`${fullUrl.origin}/`);
    }

    // If cookies are found, process them
    if (cookie) {
        console.log('hello')
        const data = decodeBase64(cookie.value);

        if (data) {
            const user = JSON.parse(data);
            console.log("Decoded Data: ", user);

            const userPaths = ["/user , /user/schedule"];
            const superadminPaths = ["/superadmin"];
            const adminPaths = ["/scanner"];
            
            if (user.role === 'auth' && pathname !=="/user") {
                if (!userPaths.includes(pathname)) {
                    console.log("User is authenticated but trying to access a restricted path, redirecting to /user");
                    return NextResponse.redirect(`${fullUrl.origin}/user`);
                }
            } else if (user.role === 'admin' && pathname !== "/admin") {
                if (!adminPaths.includes(pathname)) {
                console.log("User is an admin, redirecting to /admin");
                return NextResponse.redirect(`${fullUrl.origin}/admin`);
                }
            } else if (user.role === 'superadmin' && pathname !== "/superadmin") {
                if (!superadminPaths.includes(pathname)) {
                console.log("User is a superadmin, redirecting to /superadmin");
                return NextResponse.redirect(`${fullUrl.origin}/superadmin`);
                }
            } else if (user.role === 'unauth' && pathname !== "/notpaid") {
                console.log("User is unauthenticated, redirecting to /notpaid");
                return NextResponse.redirect(`${fullUrl.origin}/notpaid`);
            }
        } else {
            console.error("Failed to decode cookie data.");
        }
    }

    // If no special case, continue to the next middleware
    return NextResponse.next();
}

export const config = {
    matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};