import { useContext, useEffect, useState } from "react"
import Categories from "./Categories/Categories";
import { NavigationContext } from "../../../fragments/Contexts";
import { useTranslation } from "react-i18next";
import Items from "./Items/Items";

export default function MenuControl() {
    const [category, setCategory] = useState();
    const navigationContext = useContext(NavigationContext);
    const { t } = useTranslation();
    useEffect(() => {
        navigationContext.useControlPanelNavigation();
    }, []);

    return (<>
        <div className="menu-control row-wrapper fade-in">
            <div className="categories field column-wrapper">
                <h2>{t('menusHeader')}</h2>
                <Categories active={category} setActive={setCategory} />
            </div>
            <div className="product field column-wrapper">
                <Items active={category} />
            </div>
        </div>
    </>)
}