/* eslint-disable no-unused-vars */
import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "./routeConfig";
import ProtectedRoute from "./ProtectedRoute";
import LoadingScreen from "../components/LoadingScreen";
import RoleGuard from './RoleGuard';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />

      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {ROUTES.map(({ path, element: Element, public: isPublic, roles }) => {
            if (isPublic) {
              return <Route key={path} path={path} element={<Element />} />;
            }

            return (
              <Route key={path} element={<ProtectedRoute />}>
                <Route
                  path={path}
                  element={
                    roles ? (
                      <RoleGuard roles={roles}>
                        <Element />
                      </RoleGuard>
                    ) : (
                      <Element />
                    )
                  }
                />
              </Route>
            );
          })}
        </Routes>
      </Suspense>

      <Footer />
    </BrowserRouter>
  );
}
