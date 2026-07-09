import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom';


import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';



export default function AppRouter() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />


                <Route
                    path="/"
                    element={<Dashboard />}
                />

            </Routes>

        </BrowserRouter>
    );
}