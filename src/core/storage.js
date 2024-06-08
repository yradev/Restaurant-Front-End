import i18next from "i18next";

export function getLanguage() {
    return i18next.language;
};

export function getAuthDetails() {
    let authDetails = JSON.parse(localStorage.getItem('authDetails'));

    return {
        ...authDetails,
        setCredentionals(data) {
            localStorage.setItem('authDetails', JSON.stringify(data))
        },
        clearCredentionals() {
            localStorage.removeItem('authDetails');
        }
    }
}

export function getRememberMeDetails() {
    let rememberMeDetails = JSON.parse(localStorage.getItem('userDetails'));

    return {
        data: rememberMeDetails,
        setCredentionals(data) {
            localStorage.setItem('userDetails', JSON.stringify(data));
        },
        clearCredentionals() {
            localStorage.removeItem('userDetails');
        }
    }
}

export function getFavoritesActions() {
    let favorites = JSON.parse(localStorage.getItem('favorites'));

    return {
        get() { return favorites === null ? [] : favorites },
        clear() { localStorage.removeItem('favorites') },
        addItem(id) {
            if (favorites === null) {
                favorites = [id]
            } else {

                favorites.push(id);

            };
            localStorage.setItem('favorites', JSON.stringify(favorites));
        },
        removeItem(id) {
            localStorage.setItem('favorites', JSON.stringify(favorites.filter(a => a !== id)));
        },
        checkItem(id) {
            if (favorites === null) {
                return false;
            }
            return favorites.includes(id);
        }
    }
}

export function getDeliveriesBagActions() {
    let deliveriesBag = JSON.parse(localStorage.getItem('deliveries-bag'));

    return {
        get() { return deliveriesBag === null ? [] : deliveriesBag },
        clear() { localStorage.removeItem('deliveries-bag') },
        addItem(id) {
            if (deliveriesBag === null) {
                deliveriesBag = [{ id, count: 1 }]
            } else {
                if (deliveriesBag.some(a => a.id === id)) {
                    deliveriesBag.map(a => {
                        if (a.id === id) {
                            const count = a.count += 1;
                            a.count = count;
                        }
                        return a;
                    });
                } else {
                    deliveriesBag.push({ id, count: 1 });
                }
            };

            localStorage.setItem('deliveries-bag', JSON.stringify(deliveriesBag));
        },
        removeItem(id) {
            deliveriesBag = deliveriesBag.filter(a => a.id !== id);
            localStorage.setItem('deliveries-bag', JSON.stringify(deliveriesBag));
        },
        removeOneFromItem(id) {
            let forDelete = false;
            deliveriesBag = deliveriesBag.map(a => {
                if (a.id === id) {
                    if (a.count > 1) {
                        a.count = a.count - 1;
                    } else {
                        forDelete = true;
                    }
                }
                return a;
            });

            if (forDelete) {
                this.removeItem(id);
            } else {
                localStorage.setItem('deliveries-bag', JSON.stringify(deliveriesBag));
            }
        }
    }
}