import type { NextPage } from 'next';
import styles from './index.module.scss';

const Footer: NextPage = () => {
  return (
    <div className={styles.footer}>
      <p>Next.js搭建的个人博客</p>
    </div>
  );
};

export default Footer;
