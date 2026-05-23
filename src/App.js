import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "./context/Web3Context";
import { ToastProvider } from "./context/ToastContext";
import NavBar from "./components/navbar/Navbar";
import { ROUTES } from "./config/routes";
import { ROUTE_ELEMENTS } from "./config/routeElements";
import { LoadingSpinner } from "./components/shared/PageLayout";

function App() {
  return (
    <Web3Provider>
      <ToastProvider>
        <BrowserRouter>
          <NavBar />
          <Suspense fallback={<LoadingSpinner label="Loading page…" />}>
            <Routes>
              <Route path={ROUTES.HOME} element={ROUTE_ELEMENTS.home} />
              <Route path={ROUTES.HOW_IT_WORKS} element={ROUTE_ELEMENTS.howItWorks} />
              <Route path={ROUTES.ABOUT} element={ROUTE_ELEMENTS.about} />
              <Route path={ROUTES.DEVELOPERS} element={ROUTE_ELEMENTS.developers} />
              <Route path={ROUTES.MARKETPLACE} element={ROUTE_ELEMENTS.marketplace} />
              <Route path={ROUTES.MY_PROPERTIES} element={ROUTE_ELEMENTS.myProperties} />
              <Route path={ROUTES.RENTALS} element={ROUTE_ELEMENTS.rentals} />
              <Route path={ROUTES.FRACTIONAL} element={ROUTE_ELEMENTS.fractional} />
              <Route path={ROUTES.STAKING} element={ROUTE_ELEMENTS.staking} />
              <Route path={ROUTES.ADMIN} element={ROUTE_ELEMENTS.admin} />
              <Route path="*" element={ROUTE_ELEMENTS.notFound} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </Web3Provider>
  );
}

export default App;
