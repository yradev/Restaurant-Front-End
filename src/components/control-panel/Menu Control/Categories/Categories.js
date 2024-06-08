import { useEffect, useState } from "react";
import { del, get } from "../../../../core/connection";
import { useTranslation } from "react-i18next";
import Pagination from "../../../../fragments/Pagination";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";

export default function Categories({ active, setActive }) {
    const [categories, setCategories] = useState();
    const [categoryPage, setCategoryPage] = useState(0);
    const [categoryAddOpened, setCategoryAddOpened] = useState(false);
    const [categoryEdit, setCategoryEdit] = useState({
        status: false,
        changeStatus(category) {
            if (!this.status) {
                this.category = category;
            } else {
                delete this.category;
            }

            this.status = !this.status;
            setCategoryEdit({ ...this })
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
    const { t } = useTranslation();
    useEffect(() => {
        (async () => {
            try {
                const data = await get('/categories')

                const splitBy5 = [];

                for (let index = 0; index < data.length; index += 5) {
                    const array = data
                        .slice(index, index + 5);

                    splitBy5.push(array);
                }
                setCategories(splitBy5);
                setActive(undefined);
            } catch (err) {
                setCategories(undefined);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryPage, t, updater]);

    if (categories === undefined) {
        return;
    }

    function activeHandler(position) {
        setActive(position);
    }

    function deleteHandler(position) {
        const options = {
            title: t('deleteHeader'),
            message: t('deleteCategoryConfirmAlert'),
            buttons: [
                {
                    label: t('YesButton'),
                    onClick: async () => {
                        try {
                            await del('/categories/delete/' + position);
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
        <div className="categories-body column-wrapper">
            {categories.length > 0 ?
                (<>
                    <div className="row-wrapper">
                        <span>#</span>
                        <span>{t('nameLabel')}</span>
                        <span>{t('detailsLabel')}</span>
                        <span>{t('actionsLabel')}</span>
                    </div>
                    {categories[categoryPage].map(category => (<>
                        <div className={active === category.position ? 'row-wrapper active' : 'row-wrapper'}>
                            <span>{category.position}</span>
                            <span>{category.name}</span>
                            <div className="details row-wrapper">
                                <OverlayTrigger
                                    placement='top'
                                    overlay={
                                        <Tooltip>
                                            {category.description}
                                        </Tooltip>
                                    }>
                                    <img
                                        alt="Not Found"
                                        type='button'
                                        src="/images/description.png" />
                                </OverlayTrigger>
                                <OverlayTrigger
                                    placement='top'
                                    overlay={
                                        <Tooltip>
                                            {category.countItems} {t('countTranslation')}.
                                        </Tooltip>
                                    }>
                                    <img
                                        alt="Not Found"
                                        type='button'
                                        src="/images/items.png"
                                    />
                                </OverlayTrigger>
                                <OverlayTrigger
                                    placement='top'
                                    overlay={
                                        <Tooltip>
                                            {category.totalPrice.toFixed(2)} BGN.
                                        </Tooltip>
                                    }>
                                    <img
                                        alt="Not Found"
                                        type='button'
                                        src="/images/price.png" />
                                </OverlayTrigger>
                            </div>
                            <div className="row-wrapper actions">
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
                                        alt="Not Found"
                                        onClick={() => categoryEdit.changeStatus(category)}
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
                                        alt="Not Found"
                                        type='button'
                                        src="/images/delete.png"
                                        onClick={() => deleteHandler(category.position)}
                                    />
                                </OverlayTrigger>
                                <OverlayTrigger
                                    placement='top'
                                    overlay={
                                        <Tooltip>
                                            {t('selectTooltip')}
                                        </Tooltip>
                                    }>
                                    <img
                                        alt="Not Found"
                                        type='button'
                                        src="/images/click.png"
                                        onClick={() => activeHandler(category.position)} />
                                </OverlayTrigger>
                            </div>
                        </div>
                    </>))}
                </>) : (<>
                    <h1 className="empty">{t('categoriesEmpty')}</h1>
                </>)}
        </div>
        <div className="bottom row-wrapper">
            {categories.length > 0 ? (<>
                <Pagination items={categories} page={categoryPage} setPage={setCategoryPage} />
            </>) : null}
            <button
                className="btn-secondary right"
                onClick={() => setCategoryAddOpened(true)}
            >{t('addCategoryButton')}
            </button>
        </div>

        {categoryAddOpened ? <AddCategory isModalOpened={setCategoryAddOpened} updater={updater} /> : null}
        {categoryEdit.status ? <EditCategory data={categoryEdit.category} closeModal={() => categoryEdit.changeStatus()} updater={updater} /> : null}
    </>)
}