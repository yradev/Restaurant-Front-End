import { Suspense } from "react";
import { Route, Routes } from "react-router";
import Homepage from "./templates/Homepage";

export default function Router() {
    return (
        <Suspense>
            <Routes>
                <Route path="/" element={<Homepage />} />
            </Routes>
        </Suspense>
    );
}