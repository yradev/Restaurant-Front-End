import { useContext, useEffect, useState } from "react";
import { Alert, OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { getDeliveriesBagActions, getFavoritesActions } from "../../../core/storage";
import { get } from "../../../core/connection";
import { ItemsPanelContext } from "../../../fragments/Contexts";

export default function Favorites() {
    const [favorites, setFavorites] = useState();
    const itemsContext = useContext(ItemsPanelContext);

    const [hovered, setHover] = useState(null);
    const [added, setAdded] = useState();
    const { t } = useTranslation();

    useEffect(() => {
        const favoritesData = itemsContext.favorites;

        (async () => {
            const result = await Promise.all(favoritesData.map(
                async (i) => {
                    const tempItem = await get(`/items/${i}`);
                    return tempItem;
                }));

            setFavorites(result);

        })()
    }, [itemsContext]);
    useEffect(() => {

        const timer = setTimeout(() => {
            setAdded(undefined);
        }, 2000);

        return () => clearTimeout(timer);
    }, [added])


    if (favorites === undefined) {
        return <Spinner />
    }

    function addToBag(id, name) {
        getDeliveriesBagActions().addItem(id);
        setAdded(name);
    }

    function removeFromFavorites(id) {
        getFavoritesActions().removeItem(id);
        itemsContext.updateFavorites();
    }

    function clearHandler() {
        getFavoritesActions().clear();
        itemsContext.updateFavorites();
    }

    return (
        <div className="column-wrapper items-panel-body favorites-body">
            {favorites.length > 0 ?
                <>
                    {added !== undefined ?
                        <Alert
                            variant="success"
                            className="favorites-alert">
                            {added} {t('addedToDeliveryBagAlert')}
                        </Alert>
                        :
                        null}
                    <div className="items">
                        {favorites.map(item => (
                            <div
                                className="item"
                                key={favorites.indexOf(item)}
                                onMouseEnter={() => setHover({ categoryPosition: item.categoryPosition, itemPosition: item.itemPosition })}
                                onMouseLeave={() => setHover(null)}>

                                <img
                                    alt="not found"
                                    src={item.imageUrl}
                                    className="logo" />
                                <div className="details">
                                    <span>{item.categoryName}</span>
                                    <span>{item.itemName}</span>
                                    <div className="price">{item.price.toFixed(2)} BGN
                                        {
                                            hovered !== null &&
                                                hovered.categoryPosition === item.categoryPosition &&
                                                hovered.itemPosition === item.itemPosition
                                                ? <>
                                                    <OverlayTrigger
                                                        placement='top'
                                                        overlay={
                                                            <Tooltip>
                                                                {t('addToBagTooltip')}
                                                            </Tooltip>
                                                        }>
                                                        <img
                                                            alt="not found"
                                                            src='/images/item-add.png'
                                                            type='button' onClick={() => {
                                                                addToBag(item.id, item.itemName);
                                                            }} />
                                                    </OverlayTrigger>

                                                    <OverlayTrigger
                                                        placement='top'
                                                        overlay={
                                                            <Tooltip>
                                                                {t('deleteTooltip')}
                                                            </Tooltip>
                                                        }>

                                                        <img
                                                            alt="not found"
                                                            src='/images/delete.png'
                                                            type='button'
                                                            onClick={() => {
                                                                removeFromFavorites(item.id);
                                                            }} />
                                                    </OverlayTrigger>
                                                </>
                                                :
                                                null}
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                    <button
                        className="btn-primary clear-favorites" onClick={clearHandler}>
                        {t('clearFavoritesButton')}
                    </button>
                </>
                :
                <p className="empty">{t('favoritesEmpty')}</p>
            }
        </div>
    )
}
