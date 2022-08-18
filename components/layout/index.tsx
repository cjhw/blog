import type { NextPage } from 'next';
import Navbar from 'components/Navbar';
import Footer from 'components/Footer';
import { PropsWithChildren } from 'react';

const Layout: NextPage<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
