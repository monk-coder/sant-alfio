import React, { useContext, useEffect, useState } from 'react';
import dayjs from "dayjs";
import { NavBarDashboard } from "@components/sm/NavBar.tsx";
import {
    type RecentOperationsResponse,
    type RecentlyUpdatedGoodsResponse,
    type RecentMovementsResponse,
    type ProductsDetailResponse
} from "@types/Responses.ts";
import type { RecentOperation } from "@types/Operations.ts";
import type { RecentlyUpdatedProduct } from "@types/Products.ts";
import type { Shipment } from "@types/Shipments.ts";
import styles from "./Dashboard.module.css";
import Loader from "@ui/loader";
import { useApi } from "@utils/api";
import AuthContext, { type AuthContextType } from "@context/AuthContext.tsx";
import type { ProductDetail } from "@types/Products.ts";

export const Dashboard: React.FC = (): React.ReactElement => {
    const { isLoading, setIsLoading } = useContext(AuthContext) as AuthContextType;
    const { fetchWithAuth } = useApi();
    const [restockNumber, setRequireRestockNumber] = useState<number>(0);
    const [latestGoodsChanges, setLatestGoodsChanges] = useState<RecentlyUpdatedProduct[]>([]);
    const [recentOperations, setRecentOperations] = useState<RecentOperation[]>([]);
    const [recentMovements, setRecentMovements] = useState<Shipment[]>([]);


    const fetchAllData = async () => {
        if (isLoading) return;

        setIsLoading(true);

        try {
            const response: Response = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}/products/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch restock number");
            }

            const data: ProductsDetailResponse = await response.json();
            const requireRestock = data.map((item: ProductDetail) => (item.current_quantity <= item.min_stock_level));
            const restockNumber = requireRestock.reduce((acc: number, curr: boolean) => acc + (curr ? 1 : 0), 0);
            setRequireRestockNumber(restockNumber);
        } catch (error) {
            console.error("Error fetching restock number:", error);
        }

        try {
            const goodsResponse: Response = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}/products/last/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!goodsResponse.ok) {
                throw new Error("Failed to fetch recently updated goods");
            }
            const goodsData: RecentlyUpdatedGoodsResponse = await goodsResponse.json();
            setLatestGoodsChanges(goodsData);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }

        try {
            const operationsResponse: Response = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}/movements/last/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!operationsResponse.ok) {
                throw new Error("Failed to fetch recent operations");
            }
            const operationsData: RecentOperationsResponse = await operationsResponse.json();
            setRecentOperations(operationsData);
        } catch (e) {
            console.error(e);
        }

        try {
            const movementsResponse: Response = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}/operations/last/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!movementsResponse.ok) {
                throw new Error("Failed to fetch recent movements data");
            }
            const movementsData: RecentMovementsResponse = await movementsResponse.json();
            setRecentMovements(movementsData);
        } catch (e) {
            console.error(e);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    return (
        <div className={styles.dashboardPage}>
            {isLoading && (
                <div className={styles.loaderContainer}>
                    <Loader size="large"/>
                </div>
            )}
            <NavBarDashboard/>

            <div className={styles.dashboard}>
                <div className={styles.restockNumberContainer}>
                    <h2 className={styles.restockNumber}>{restockNumber}</h2>
                    <p className={styles.restockNumberText}>
                        {restockNumber === 1 ? "Нуждается в пополнении" : "Нуждаются в пополнении"}
                    </p>
                </div>
                <div className={styles.dashboardContainer}>
                    <h3 className={styles.dashboardItemTitle}>Последние изменения товаров</h3>
                    <div className={styles.tableContainer}>
                        <table className={styles.dashboardTable}>
                            <thead>
                                <tr>
                                    <th>Название</th>
                                    <th>Категория</th>
                                </tr>
                            </thead>
                            <tbody>
                                {latestGoodsChanges.map((item: RecentlyUpdatedProduct) => (
                                    <tr className={styles.dashboardTableRow} key={item.id}>
                                        <td className={styles.dashboardTableCell}>{item.name}</td>
                                        <td className={styles.dashboardTableCell}>{item.category_id.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={styles.dashboardContainer}>
                    <h3 className={styles.dashboardItemTitle}>Последние операции</h3>
                    <div className={styles.tableContainer}>
                        <table className={styles.dashboardTable}>
                            <thead>
                            <tr>
                                <th>Товар</th>
                                <th>Тип операции</th>
                            </tr>
                            </thead>
                            <tbody>
                            {recentOperations.map((item: RecentOperation) => (
                                <tr className={styles.dashboardTableRow} key={item.id}>
                                    <td className={styles.dashboardTableCell}>{item.operation_id.product_id.name}</td>
                                    <td className={styles.dashboardTableCell}>{item.operation_id.operation_type}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={styles.dashboardContainer}>
                    <h3 className={styles.dashboardItemTitle}>Последние отгрузки</h3>
                    <div className={styles.tableContainer}>
                        <table className={styles.dashboardTable}>
                            <thead>
                            <tr>
                                <th>Тип</th>
                                <th>Дата</th>
                                <th>Товар</th>
                            </tr>
                            </thead>
                            <tbody>
                            {recentMovements.map((item: Shipment) => (
                                <tr className={styles.dashboardTableRow} key={item.id}>
                                    <td className={styles.dashboardTableCell}>{item.operation_type}</td>
                                    <td className={styles.dashboardTableCell}>
                                        {dayjs(item.date).format("HH:mm DD-MM-YY")}
                                    </td>
                                    <td className={styles.dashboardTableCell}>{item.product_id.name}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};