import { get, post } from "./connection";
import { getAuthDetails } from "./storage";

export async function updateRoles() {
    const roles = await get("/user");
    console.log(roles.roles);
    return roles.roles.map(a => Object.values(a)[0].substring(5));

}

export async function login(email, password) {
    const token = await post('/auth/login', { email, password });
    const expireTime = new Date();
    expireTime.setMinutes(expireTime.getMinutes() + 10);

    const authData = getAuthDetails();
    authData.setCredentionals({
        token,
        email,
        expireTime
    });

    return {
        isLogged: true,
        token,
        email,
        roles: await updateRoles(),
        expireTime,
    }
}

export async function updateAuthentication() {
    const authDetails = getAuthDetails();
    return {
        isLogged: true,
        token: authDetails.token,
        expireTime: authDetails.expireTime,
        email: authDetails.email,
        roles: await updateRoles()
    };
}


export async function registration(email, password) {
    await post('/auth/register', { email, password });
}

export async function forgotPassword(email) {
    await post('/auth/reset-password/verification/send',
        {
            email,
            url: process.env.REACT_APP_WRONG_PASSWORD_VERIFY_URL
        });
}

export function logout() {
    getAuthDetails().clearCredentionals();
}