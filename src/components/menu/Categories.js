import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { NavigationContext } from "../../fragments/Contexts";
import { get } from "../../core/connection";
import { Spinner } from "react-bootstrap";

export default function Categories() {

    const { t } = useTranslation();
    const navigationContext = useContext(NavigationContext);
    const [categories, setCategories] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        navigationContext.useSmallNavigation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        try {
            (async () => {
                const result = await get('/categories');

                const categoriesSplitBy3 = []

                for (let index = 0; index < result.length; index += 3) {
                    const currentCategories = result
                        .filter(a => a.position > index)
                        .slice(0, 3);

                    categoriesSplitBy3.push(currentCategories);
                }

                setCategories(categoriesSplitBy3);
            })()
        } catch (error) {
        }
    }, [t]);

    if (categories === undefined) {
        return <Spinner />
    }
    return (<>
        <h1 style={{ textAlign: 'center', padding: '20px 0' }}>{t('menusHeader')}</h1>
        <div className="menus column-wrapper">
            {categories.length !== 0 ? (
                categories.map(row => {
                    return <div className="items-row row-wrapper fade-in" key={categories.indexOf(row)}>
                        {row.map(category => {
                            return <div className="item" key={row.indexOf(category)}>
                                <div className="logo category-logo">
                                    <img
                                        alt="not found"
                                        src={category.imageUrl + `?cache=${Math.random()}`} onError={(event) => {
                                            event.target.src = '/images/not-found-image.jpg'
                                        }} />
                                </div>
                                <h3>{category.name}</h3>
                                <h6>{category.description}</h6>

                                <button
                                    type="button"
                                    className="btn-primary"
                                    onClick={() => {
                                        navigate(`/menu/${category.position}`)
                                    }}
                                >{t('openMenuButton')}</button>
                            </div>
                        })}
                    </div>
                })
            ) : (
                <h1 className="empty-menu">
                    {t('categoriesEmpty')}
                </h1>
            )}
        </div>
    </>
    )
}