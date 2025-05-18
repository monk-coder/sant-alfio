import React from 'react';
import {NavBarItem, GoBack, Logout} from "@ui/NavBarItem.tsx";
import type {NavBar} from "@types/Navbar.ts";
import styles from './NavBar.module.css'
import goodsIcon from "@assets/icons/goods.png"
import shipmentIcon from "@assets/icons/shipment.png"
import reportIcon from "@assets/icons/report.png"
import listIcon from "@assets/icons/list.png"
import dashboardIcon from "@assets/icons/dashboard.png"
import plusIcon from "@assets/icons/plus.png"

export const NavBarDashboard: React.FC<NavBar> = (): React.ReactElement => {
  return (
    <nav className={styles.navBarDashboard}>
        <div className={styles.navBarItems}>
            <NavBarItem to={"/products"} icon={goodsIcon} reqireAdmin={false}/>
            <NavBarItem to={"/shipments"} icon={shipmentIcon} reqireAdmin={false}/>
            <NavBarItem to={"/operations"} icon={listIcon} reqireAdmin={true}/>
            <NavBarItem to={"/reports"} icon={reportIcon} reqireAdmin={true}/>
        </div>
        <Logout />
    </nav>
  );
};

const NavBar: React.FC<NavBar> = ({page, current}: NavBar): React.ReactElement => {
  return (
    <nav className={page != "dashboard" ? styles.navBar : styles.navBarDashboard}>
        <GoBack />
        <div className={styles.navBarItems}>
            <NavBarItem to={"/"} icon={dashboardIcon} reqireAdmin={false} current={current}/>
            <NavBarItem to={`/${page}`} icon={listIcon} reqireAdmin={false} current={current}/>
            <NavBarItem to={`/${page}/create`} icon={plusIcon} reqireAdmin={true} current={current}/>
        </div>
        <Logout />
    </nav>
  );
};

export default NavBar;