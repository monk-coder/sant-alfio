import React, {useEffect, useState} from 'react';
import { useContext } from 'react';
import dayjs from "dayjs";
import AuthContext, {type AuthContextType} from '@context/AuthContext';
import {NavBarDashboard} from "@components/sm/NavBar.tsx";
import {type RestockNumberResponse, type RecentlyUpdatedGoodsResponse, type RecentMovementsResponse} from "@types/Responses.ts";
import type {RecentOperation} from "@types/Operations.ts";
import type {RecentlyUpdatedGood} from "@types/Products.ts"
import type {RecentMovement} from "@types/Movements.ts";
import styles from "./Dashboard.module.css"
import Loader from "@components/UI/loader";


const mockRestockNumber: number = 14
const mockLatestGoodsChanges: RecentlyUpdatedGood[] = [
    {
        id: 1,
        name: "Product 1",
        category: "Category 1"
    },
    {
        id: 2,
        name: "Product 2",
        category: "Category 2"
    },
    {
        id: 3,
        name: "Product 3",
        category: "Category 1"
    },
    {
        id: 4,
        name: "Product 4",
        category: "Category 2"
    },
    {
        id: 5,
        name: "Product 5",
        category: "Category 3"
    }
]
const mockRecentOperations: RecentOperation[] = [
    {
        id: 5,
        type: "INSERT",
        item: "Product 5",
    },
    {
        id: 4,
        type: "Update",
        item: "Product 2",
    },
    {
        id: 3,
        type: "Update",
        item: "Product 2",
    },
    {
        id: 2,
        type: "Update",
        item: "Product 2",
    },
    {
        id: 1,
        type: "Delete",
        item: "Product 6",
    }
]
const mockRecentMovements: RecentMovement[] = [
    {
        type: "shipment",
        date: "2025-05-16T00:00:00.000Z",
        product: "Product 1"
    },
    {
        type: "shipment",
        date: "2025-05-15T00:00:00.000Z",
        product: "Product 2"
    },
    {
        type: "shipment",
        date: "2025-05-14T00:00:00.000Z",
        product: "Product 1"
    },
    {
        type: "shipment",
        date: "2025-05-13T12:00:00.000Z",
        product: "Product 4"
    },
    {
        type: "shipment",
        date: "2025-05-12T00:00:00.000Z",
        product: "Product 3"
    },
]

export const Dashboard: React.FC = (): React.ReactElement => {
    const { user } = useContext(AuthContext) as AuthContextType;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [restockNumber, setRequireRestockNumber] = useState<number>(0);
    const [latestGoodsChanges, setLatestGoodsChanges] = useState<RecentlyUpdatedGood[]>([]);
    const [recentOperations, setRecentOperations] = useState<RecentOperation[]>([])
    const [recentMovements, setRecentMovements] = useState<RecentMovement[]>([])

    const fetchRestockNumber = async () => {
        setRequireRestockNumber(mockRestockNumber)
        // const response: Response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/restock/count`, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${user.token}`
        //     }
        // });
        //
        // if (!response.ok) {
        //     console.log("Failed to fetch number of items requiring restock")
        //     return
        // }
        //
        // const data: RestockNumberResponse = await response.json();
        // setRequireRestockNumber(data.value);
    }

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            await fetchRestockNumber();

            // Fetch latest goods changes
            // const goodsResponse: Response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/goods?latest=5`, {
            //     method: 'GET',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${user.token}`
            //     }
            // })
            // if (!goodsResponse.ok) {
            //     console.error("Failed to fetch recently updated goods")
            // } else {
            //     const goodsData: RecentlyUpdatedGoodsResponse = await goodsResponse.json()
            //     setLatestGoodsChanges(goodsData.data)
            // }
            setLatestGoodsChanges(mockLatestGoodsChanges);

            // Fetch recent operations
            // const operationsResponse: Response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/operations?latest=5`, {
            //     method: "GET",
            //     headers: {
            //         "Content-Type": "application/json",
            //         "Authorization": `Bearer ${user.token}`
            //     }
            // })
            // if (!operationsResponse.ok) {
            //     console.error("Failed to fetch recent operations")
            // } else {
            //     const operationsData: RecentOperationsResponse = await operationsResponse.json()
            //     setRecentOperations(operationsData.data)
            // }
            setRecentOperations(mockRecentOperations);

            // Fetch latest movements
            // const movementsResponse: Response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/movements?latest=5`, {
            //     method: "GET",
            //     headers: {
            //         "Content-Type": "application/json",
            //         "Authorization": `Bearer ${user.token}`
            //     }
            // })
            // if (!movementsResponse.ok) {
            //     console.error("Failed to fetch recent movements data")
            // } else {
            //     const movementsData: RecentMovementsResponse = await movementsResponse.json()
            //     setRecentMovements(movementsData.data)
            // }
            setRecentMovements(mockRecentMovements);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    return (
        <div className={styles.dashboardPage}>
            {isLoading && (
                <div className={styles.loaderContainer}>
                    <Loader size="large" />
                </div>
            )}
            <NavBarDashboard/>

            <div className={styles.dashboard}>
                <div className={styles.restockNumberContainer}>
                    <h2 className={styles.restockNumber}>{restockNumber}</h2>
                    <p className={styles.restockNumberText}>{restockNumber == 1 ? "Нуждается в пополнении" : "Нуждаются в пополнении"}</p>
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
                                {
                                    latestGoodsChanges.map((item: RecentlyUpdatedGood) => (
                                        <tr className={styles.dashboardTableRow} key={item.id}>
                                            <td className={styles.dashboardTableCell}>{item.name}</td>
                                            <td className={styles.dashboardTableCell}>{item.category}</td>
                                        </tr>
                                    ))
                                }
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
                                    <th>Тип</th>
                                    <th>Товар</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    recentOperations.map((item: RecentOperation) => (
                                        <tr className={styles.dashboardTableRow} key={item.id}>
                                            <td className={styles.dashboardTableCell}>{item.type}</td>
                                            <td className={styles.dashboardTableCell}>{item.item}</td>
                                        </tr>
                                    ))
                                }
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
                                {
                                    recentOperations.map((item: RecentMovement) => (
                                        <tr className={styles.dashboardTableRow} key={item.id}>
                                            <td className={styles.dashboardTableCell}>{item.type}</td>
                                            <td className={styles.dashboardTableCell}>{dayjs(item.date).format(" hh:mm DD-MM-YY")}</td>
                                            <td className={styles.dashboardTableCell}>{item.item}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
