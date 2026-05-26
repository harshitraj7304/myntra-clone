import { Route, Routes } from 'react-router-dom'
import React, { Suspense } from 'react'
import MainLayout from '../layouts/MainLayout'
import { appRoutes } from './routeConfig'

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-white space-y-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-100 border-t-[#ff3f6c]" />
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">
        Loading Premium Collection...
      </span>
    </div>
  )
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          {appRoutes.map((route) =>
            route.index ? (
              <Route key="home" index element={route.element} />
            ) : (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ),
          )}
        </Route>
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
