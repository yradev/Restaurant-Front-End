import { Suspense, useContext } from "react";
import { Spinner } from "react-bootstrap";
import { Route, Routes } from "react-router";
import Home from "./components/home/Home";
import Reservation from "./components/reservation/Reservation";
import Categories from "./components/menu/Categories";
import Items from "./components/menu/Items";
import { AuthenticationContext } from "./fragments/Contexts";
import Dashboard from "./components/home/Dashboard";
import PasswordReset from "./components/navigation/auth/PasswordReset";
import NotFound from "./components/error/NotFound";
import CoreDetails from "./components/control-panel/Details/CoreDetails";
import ControlPanel from "./components/control-panel/ControlPanel";
import UserControl from "./components/control-panel/User Control/UserControl";
import MenuControl from "./components/control-panel/Menu Control/MenuControl";

function Wrapper({ component: Component, authCheck, subComponent: SubComponent }) {
    const authentication = useContext(AuthenticationContext);

    if (authCheck) {
        if (authentication.isLogged) {
            authCheck = true;
        } else {
            authCheck = false;
        }
    } else {
        authCheck = false;
    }

    return (
        <div className="fade-in column-wrapper" style={{
            minHeight: '90vh'
        }}>
            {authCheck ?
                <SubComponent />
                :
                <Component />
            }
        </div>
    );
}

export default function Router() {
    return (
        <Suspense fallback={<Spinner />}>
            <Routes>
                <Route path="/" element={
                    <Wrapper
                        component={Home}
                        authCheck={true}
                        subComponent={Dashboard}
                    />} />

                <Route path="/panel/:panel" element={
                    <Wrapper
                        component={Home}
                        authCheck={true}
                        subComponent={Dashboard}
                    />} />
                <Route path="/reservation" element={
                    <Wrapper
                        component={Reservation}
                        authCheck={false}
                    />} />
                <Route path="/menu" element={
                    <Wrapper
                        component={Categories}
                        authCheck={false}
                    />} />
                <Route path="/menu/:category" element={
                    <Wrapper
                        component={Items}
                        authCheck={false}
                    />} />
                <Route path="/reset-password" element={
                    <Wrapper
                        component={PasswordReset}
                        authCheck={false}
                    />} />

                <Route path="/cp" element={
                    <Wrapper
                        component={NotFound}
                        subComponent={ControlPanel}
                        authCheck={true}
                    />} />

                <Route path="/cp/details" element={
                    <Wrapper
                        component={NotFound}
                        subComponent={CoreDetails}
                        authCheck={true}
                    />} />

                <Route path="/cp/user" element={
                    <Wrapper
                        component={NotFound}
                        subComponent={UserControl}
                        authCheck={true}
                    />} />

                <Route path="/cp/menu" element={
                    <Wrapper
                        component={NotFound}
                        subComponent={MenuControl}
                        authCheck={true}
                    />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
}
