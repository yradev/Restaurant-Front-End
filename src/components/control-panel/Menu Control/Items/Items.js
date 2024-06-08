import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { del, get } from "../../../../core/connection";
import Pagination from "../../../../fragments/Pagination";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";

export default function Items({ active }) {
    const [items, setItems] = useState();
    const [itemsPage, setItemsPage] = useState(0);
    const { t } = useTranslation();
    const [categoryName, setCategoryName] = useState();
    const [addProductModalOpened, setAddProductModalOpened] = useState(false);
    const [itemEdit, setItemEdit] = useState({
        status: false,
        changeStatus(item) {
            if (!this.status) {
                this.item = item;
            } else {
                delete this.item;
            }

            this.status = !this.status;
            setItemEdit({ ...this })
        }
    });

    const [updater, setUpdater] = useState(
        {
            counter: 0,
            update() {
                this.counter = this.counter + 1;
                setUpdater({ ...this })
            }
        });

    useEffect(() => {
        if (active === undefined) {
            setItems([]);
            return;
        }

        (async () => {
            const data = await get('/items/category/' + active);
            const splitBy5 = [];

            setCategoryName(data.categoryName);

            for (let index = 0; index < data.items.length; index += 5) {
                const array = data.items
                    .slice(index, index + 5)
                splitBy5.push(array)
            }

            setItems(splitBy5);
        })();
    }, [updater, itemsPage, active, t]);

    if (items === undefined) {
        return;
    }

    function deleteHandler(position) {
        const options = {
            title: t('deleteHeader'),
            message: t('deleteItemConfirmAlert'),
            buttons: [
                {
                    label: t('YesButton'),
                    onClick: async () => {
                        try {
                            await del('/items/delete/category/' + active + '/item/' + position);
                            updater.update();
                        } catch (err) {

                        }
                    }
                },
                {
                    label: t('NoButton'),
                }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
            keyCodeForClose: [8, 32],
            overlayClassName: "overlay-custom-class-name"
        };

        confirmAlert(options);
    };


    return (<>
        {active !== undefined ?
            (<>
                {items.length > 0
                    ?
                    (<>
                        <h2>{categoryName}</h2>
                        <div className="column-wrapper items-body">
                            <div className="row-wrapper">
                                <span>#</span>
                                <span>{t('nameLabel')}</span>
                                <span>{t('detailsLabel')}</span>
                                <span>{t('actionsLabel')}</span>
                            </div>
                            {items[itemsPage].map(item => (<>
                                <div className="row-wrapper">
                                    <span>#</span>
                                    <span>{item.name}</span>
                                    <div className="details row-wrapper">
                                        <OverlayTrigger
                                            placement='top'
                                            overlay={
                                                <Tooltip>
                                                    {item.description}
                                                </Tooltip>
                                            }>
                                            <img type='button' src="/images/description.png" />
                                        </OverlayTrigger>
                                        <OverlayTrigger
                                            placement='top'
                                            overlay={
                                                <Tooltip>
                                                    {item.price.toFixed(2)} BGN.
                                                </Tooltip>
                                            }>
                                            <img type='button' src="/images/price.png" />
                                        </OverlayTrigger>
                                    </div>
                                    <div className="actions row-wrapper">
                                        <OverlayTrigger
                                            placement='top'
                                            overlay={
                                                <Tooltip>
                                                    {t('editTooltip')}
                                                </Tooltip>
                                            }>
                                            <img
                                                type='button'
                                                src="/images/edit.png"
                                                onClick={() => itemEdit.changeStatus(item)}
                                            />
                                        </OverlayTrigger>
                                        <OverlayTrigger
                                            placement='top'
                                            overlay={
                                                <Tooltip>
                                                    {t('deleteTooltip')}
                                                </Tooltip>
                                            }>
                                            <img
                                                type='button'
                                                src="/images/delete.png"
                                                onClick={() => deleteHandler(item.position)} />
                                        </OverlayTrigger>
                                    </div>
                                </div>
                            </>))}
                        </div>
                    </>)
                    :
                    (<>
                        <h2>{categoryName}</h2>
                        <h5 className="empty">{t('productsEmpty')}</h5>
                    </>)}
            </>)
            :
            (<>
                <h2>{t('productsHeader')}</h2>
                <h5 className="empty">{t('notSelectedMenu')}</h5>
            </>)
        }

        <div className="bottom row-wrapper">
            {items.length > 0 ? (<>
                <Pagination items={items} page={itemsPage} setPage={setItemsPage} />
            </>) : null}

            {active !== undefined ? (<>
                <button
                    className="btn-secondary right"
                    onClick={() => setAddProductModalOpened(true)}>{t('addProductButton')}</button>
            </>) : null}
        </div>

        {addProductModalOpened ? <AddProduct isModalOpened={setAddProductModalOpened} updater={updater} categoryPosition={active} /> : null}
        {itemEdit.status ? <EditProduct data={itemEdit.item} closeModal={()=>itemEdit.changeStatus()} updater={updater} categoryPosition = {active} /> : null}
    </>);
}