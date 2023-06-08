import routes from './routes/routes';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DefaultLayout from './layouts/DefaultLayout/DefaultLayout';
import { Fragment } from 'react';
import NotFound from './pages/NotFound/NotFound';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route, index) => {
          const Component = route.component;

          let Layout = Fragment;
          if (route.layout !== null) Layout = DefaultLayout;

          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Component />
                </Layout>
              }
            />
          );
        })}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
