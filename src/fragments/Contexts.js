import { createContext, useState } from "react";
import { getAuthDetails } from "../core/storage";
import { forgotPassword, login, logout as logingOut, registration, updateAuthentication } from "../core/authentication";
import { get } from "../core/connection";

export const NavigationContext = createContext({
    variant: undefined,
    update(data) { },
    useSmallNavigation() {
        this.update({
            ...this,
            variant: 'small'
        })
    },
    useLargeNavigation(imagePath) {
        this.update({
            ...this,
            variant: 'large',
            backgroundPath: imagePath
        })
    },
    useControlPanelNavigation(){
        this.update({
            ...this,
            variant: 'controlPanel'
        })
    }
});

export const AuthenticationContext = createContext({
    update() { },
    async checkAuth() {
        const authDetails = getAuthDetails();

        if (authDetails.token === undefined) {
            this.update({
                ...this,
                isLogged: false
            })
        } else {
            const currentDate = new Date();
            const expireDate = new Date(authDetails.expireTime);

            if (currentDate > expireDate) {
                this.logout();
            } else {
                const details = await updateAuthentication();
                this.update({
                    ...this,
                    ...details
                });
            }
        }
    },

    async login(email, password) {
        const authDetails = getAuthDetails();

        const currentDate = new Date();
        const expireDate = new Date(authDetails.expireTime);

        if (authDetails !== null && currentDate <= expireDate) {
            return;
        }

        const result = await login(email, password)

        this.update({
            ...this,
            ...result
        })
    },

    async registration(email, password) {
        await registration(email, password);
    },

    logout() {
        logingOut();

        const { login, logout, checkAuth, registration, update, forgotPassword } = this;

        this.update({
            isLogged: false,
            login,
            logout,
            forgotPassword,
            checkAuth,
            registration,
            update
        });
    },

    async forgotPassword(email) {
        await forgotPassword(email);
    }
});

export const ModalsContext = createContext({
    login: false,
    loginNotification: undefined,
    forgotPassword: false,
    registration: false,
    settings: false,
    update(data) { },
    updateLogin(status, notification) {
        this.login = status;
        this.loginNotification = notification;
        this.update({ ...this })
    },
    updateForgotPassword(status) {
        this.forgotPassword = status;
        this.update({ ...this })
    },
    updateRegistration(status) {
        this.registration = status;
        this.update({ ...this })
    },
    updateSettings(status) {
        this.settings = status;
        this.update({ ...this })
    }
});


export const CoreContext = createContext({
    updateState(data) { },
    async update() {
        const result = await get('/core');
        this.updateState({ ...this, ...result });
    }
});

export const ItemsPanelContext = createContext();