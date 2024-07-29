export function decodeJWT() {
    const token = localStorage.getItem("token");
    if (!token) return null; // Handle case when there is no token

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const decodedToken = JSON.parse(jsonPayload);
    return {
        token,
        role: decodedToken.role
    };
}  