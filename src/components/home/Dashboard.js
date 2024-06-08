import { useContext, useEffect, useState } from "react";
import { AuthenticationContext, NavigationContext } from "../../fragments/Contexts";
import UserDashboard from "./DashBoard/user/Dashboard";
import StaffDashboard from "./DashBoard/staff/Dashboard";
import { useTranslation } from "react-i18next";
import { Form } from "react-bootstrap";
import { useParams } from "react-router-dom";

export default function Dashboard() {
    const auth = useContext(AuthenticationContext);
    const navigationContext = useContext(NavigationContext);
    const [currentView, setCurrentView] = useState('user')
    const params = useParams();
    const { t } = useTranslation();

    useEffect(() => {
        navigationContext.useSmallNavigation();

        if (params.panel === 'user') {
            return;
        }

        if (auth.roles.includes('STAFF')) {
            setCurrentView('staff');
        }
    }, []);

    function onChangeHandler() {
        setCurrentView(currentView === 'user' ? 'staff' : 'user')
    }
    return (<>
        {auth.roles.includes('STAFF') ? (
            <div className="dashboard-switcher row-wrapper">
                <span className={currentView === 'staff' ? 'not-active' : null}>{t('dashboardUserLabel')}</span>
                <Form.Check
                    checked={currentView === 'staff' ? true : false}
                    type="switch"
                    onChange={onChangeHandler}
                />
                <span className={currentView === 'staff' ? null : 'not-active'}>{t('dashboardStaffLabel')}</span>
            </div>
        ) : null}

        {currentView === 'user' ?
            <UserDashboard />
            :
            <StaffDashboard />}
    </>)
}