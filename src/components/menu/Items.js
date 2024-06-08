import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { get } from "../../core/connection";
import { Spinner } from "react-bootstrap";
import { ItemsPanelContext, NavigationContext } from "../../fragments/Contexts";
import { getDeliveriesBagActions, getFavoritesActions } from "../../core/storage";

export default function Items() {
    const categoryPosition = useParams().category;
    const [items, setItems] = useState();
    const { t } = useTranslation();
    const navigationContext = useContext(NavigationContext);
    const [categoryName, setCategoryName] = useState();
    const navigate = useNavigate();
    const itemsContext = useContext(ItemsPanelContext);

    useEffect(() => {
        navigationContext.useSmallNavigation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        (async () => {
            setItems(undefined);

            try {
                const result = await get('/items/category/' + categoryPosition);
                const itemsSplitBy3 = []

                for (let index = 0; index <= result.items.length - 1; index += 3) {
                    const currentItem = result.items
                        .filter(a => a.position > index)
                        .slice(0, 3);
                    itemsSplitBy3.push(currentItem);
                };

                setItems(itemsSplitBy3);
                setCategoryName(result.categoryName)
            } catch (error) {
                navigate('/')
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryPosition, t]);

    if (items === undefined) {
        return <Spinner />
    }

    function favoritesHandler(id) {
        if (getFavoritesActions().checkItem(id)) {
            getFavoritesActions().removeItem(id);
        } else {
            getFavoritesActions().addItem(id);
        }

        itemsContext.updateFavorites();
    }

    function deliveriesBagHandler(id) {
        getDeliveriesBagActions().addItem(id);
        itemsContext.updateDeliveriesBag();
    }

    return (<>
        {items.length !== 0 ?
            <div className="menus column-wrapper">
                <h1 style={{ textAlign: 'center', paddingTop: 20 }}>{categoryName}</h1>
                {items.map(row => {
                    return <div className="items-row fade-in row-wrapper" key={items.indexOf(row)}>
                        {row.map(item => {
                            return <div className="item" style={{ height: 500 }} key={row.indexOf(item)}>
                                <div className="logo item-logo">
                                    <img alt="not found" src={item.imageUrl + `?cache=${Math.random()}`} onError={(event) => {
                                        event.target.src = '/images/not-found-image.jpg'
                                    }} />
                                    <div type='button'
                                        className="top-left"
                                        onClick={() => {
                                            favoritesHandler(item.id);
                                        }}>

                                        {getFavoritesActions().checkItem(item.id) ?
                                            <>
                                                <span>{t('deleteFromFavoritesButton')}</span>
                                            </>
                                            :
                                            <>
                                                <span>{t('addToFavoritesButton')}</span>
                                            </>}
                                    </div>
                                </div>
                                <h3>{item.name}</h3>
                                <h6>{item.description}</h6>
                                <h3>{item.price.toFixed(2)} BGN</h3>
                                <div type='button' className="actions" onClick={() => {
                                    deliveriesBagHandler(item.id)
                                }}>
                                    <span>{t('addToBagButton')}</span>
                                </div>
                            </div>
                        })}
                    </div>
                })}
            </div>
            :
            <h1 className="empty-menu">
                {t('productsEmpty')}
            </h1>
        }
        <Link
            className="btn-back-to-menus"
            to='/menu'
        >
            {t('backToMenusButton')}
        </Link>
    </>)
}