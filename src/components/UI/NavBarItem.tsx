import React, {useContext} from "react";
import {Link} from "react-router-dom";
import type {NavBarItemProps} from "../../types/Navbar.ts";
import AuthContext, {type AuthContextType} from "@context/AuthContext.tsx";
import logoutIcon from "@assets/icons/logout-icon.svg"
import goBackIcon from "@assets/icons/go-back-icon.svg"
import styles from "./NavBarItem.module.css"

export const NavBarItem = React.forwardRef<HTMLLinkElement, NavBarItemProps>((props, ref) => {
    return (
        <Link ref={ref} className={styles.navBarItem} to={props.to}>
            <img className={props.current == props.to.slice(1) ? styles.navBarItemIconSelected : styles.navBarItemIcon} src={props.icon} alt={""}/>
        </Link>
    )
});

export const Logout = React.forwardRef<HTMLLinkElement, NavBarItemProps>((props, ref) => {
    const { logout } = useContext(AuthContext) as AuthContextType;

    return (
        <Link ref={ref} className={styles.navBarItem} onClick={logout}>
            <img className={styles.navBarItemIcon} src={logoutIcon} alt={"Выход"}/>
        </Link>
    )
})

export const GoBack = React.forwardRef<HTMLLinkElement, NavBarItemProps>((props, ref) => {
    return (
        <Link ref={ref} className={styles.navBarItem} onClick={() => (history.go(-1))}>
            <img className={styles.navBarItemIcon} src={goBackIcon} alt={"Назад"}/>
        </Link>
    )
})