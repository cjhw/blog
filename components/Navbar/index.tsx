import React from 'react';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/future/image';
import { useRouter } from 'next/router';
import { Button, Avatar, Dropdown, Menu, MenuProps, message } from 'antd';
import { LoginOutlined, HomeOutlined } from '@ant-design/icons';
import { useStore } from 'store';
import styles from './index.module.scss';
import { navs } from './config';
import Login from 'components/Login';
import request from 'service/fetch';


const NavBar: NextPage = () => {
  const store = useStore();
  const { userId, avatar } = store.user.userInfo;

  const {push, pathname } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);

  const handleGotoEditorPage = () => {
    if (userId) {
      push('/editor/new');
    } else {
      message.warning('请先登录');
    }
  };

  const handleLogin = () => {
    setIsShowLogin(true);
  };

  const handleClose = () => {
    setIsShowLogin(false);
  };

  const handleLogout = () => {
    request.post('/api/user/logout').then((res: any) => {
      if (res?.code === 0) {
        store.user.setUserInfo({});
      }
    });
  };
  const handleGotoPersonalPage = () => {
    push(`/user/${userId}`);
  };

  const handleItem:MenuProps["onClick"]=(e)=> {
    if(e.key==="1") {
      handleGotoPersonalPage()
    }else if(e.key==="2"){
      handleLogout()
    }
  }

  type MenuItem = Required<MenuProps>['items'][number];

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    
  ): MenuItem {
    return {
      key,
      icon,
      label  
    } as MenuItem;
  }

  const items = [
   getItem("个人主页","1",<HomeOutlined/>),
   getItem("退出登录","2",<LoginOutlined/>)
  ];

  const renderDropDownMenu = () => {
    return (
      <Menu items={items} onClick={handleItem}>
      </Menu>
    );
  };

  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>
        <Image src="/logo.svg" width={50} height={55}  />
        BLOG
      </section>
      <section className={styles.linkArea}>
        {navs?.map((nav) => (
          <Link key={nav?.label} href={nav?.value}>
            <a className={pathname === nav?.value ? styles.active : ''}>
              {nav?.label}
            </a>
          </Link>
        ))}
      </section>
      <section className={styles.operationArea}>
        <Button onClick={handleGotoEditorPage}>写文章</Button>
        {userId ? (
          <>
            <Dropdown overlay={renderDropDownMenu()} placement="bottomLeft">
              <Avatar src={avatar} size={32} />
            </Dropdown>
          </>
        ) : (
          <Button type="primary" onClick={handleLogin}>
            登录
          </Button>
        )}
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  );
};

export default observer(NavBar);
