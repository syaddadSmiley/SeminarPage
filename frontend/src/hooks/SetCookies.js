import Cookie from "js-cookie";

const SetCookie = (cookieName, token) => {
    Cookie.set(cookieName, token, {
        expires: 1,
        path: "/",
        secure: true,
        sameSite: "strict",
    });
};

export default SetCookie;