import ActiveDeliveries from "./deliveries/ActiveDeliveries";
import ActiveReservations from "./reservations/ActiveReservations";

export default function StaffDashboard() {

    return (<>
        <div className="dashboard-body fade-in">
            <div className="field column-wrapper staff-dashboard">
                <ActiveDeliveries />
            </div>
            <div className="field column-wrapper staff-dashboard">
                <ActiveReservations />
            </div>
        </div>
    </>)
}