import { useState } from "react";
import ActiveReservation from "./reservations/ActiveReservation";
import ActiveDeliveries from "./deliveries/ActiveDelivery";

export default function UserDashboard() {

    return (<>
        <div className="dashboard-body fade-in">
            <div className="field column-wrapper">
                <ActiveDeliveries/>
            </div>
            <div className="field column-wrapper">
                <ActiveReservation />
            </div>
        </div>

    </>)
}