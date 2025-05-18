import React, {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@components/sm/Navbar.tsx";
import FiltersAndSearchBar from "@components/md/FiltersAndSearchBar.tsx";
import type {Filter, FilterOption} from "@types/Filters.ts";
import AuthContext, {type AuthContextType} from "@context/AuthContext.tsx";
import type {ShipmentsResponse} from "@types/Responses.ts";
import Loader from "@components/UI/loader";
import styles from "./Shipments.module.css";
import type {Shipment} from "../../types/Shipments.ts";
import type {ShipmentTypesResponse} from "../../types/Responses.ts";
import dayjs from "dayjs";
import {useApi} from "@utils/api.ts";


export const Shipments: React.FC = (): React.ReactElement => {
    const {user, isLoading, setIsLoading} = useContext(AuthContext) as AuthContextType
    const navigate = useNavigate();
    const { fetchWithAuth } = useApi();

    const [filters, setFilters] = useState<Filter[]>([]);
    const [shipmentTypes, setShipmentTypes] = useState<FilterOption[]>([])
    const [shipmentFetchUrl, setShipmentsFetchUrl] = useState<string>("")
    const [shipments, setShipments] = useState<Shipment[]>([])
    const [searchQuery, setSearchQuery] = useState<string>("")

    const fetchShipmentTypes = async () => {
        try {
            const response = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}/shipment-types`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })

            if (!response.ok) {
                throw new Error("Failed to fetch shipment types")
            }

            const data: ShipmentTypesResponse = await response.json()
            const shipmentTypes: FilterOption = data.map((shipmentType: string): FilterOption => ({
                value: shipmentType,
                label: shipmentType
            }))
            setShipmentTypes(shipmentTypes)
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        fetchShipmentTypes()

        const filters: Filter[] = [
            {
                title: "С даты",
                paramName: "fromDate",
                options: [],
                type: "date"
            },
            {
                title: "По дату",
                paramName: "toDate",
                options: [],
                type: "date"
            },
            {
                title: "Тип",
                paramName: "stock",
                options: shipmentTypes,
                type: "select"
            },
        ]

        setFilters(filters);
    }, []);

    const buildFetchUrl = () => {
        const params: string[] = [];

        filters.forEach(filter => {
            if (filter.state !== undefined && filter.state.value !== '' && filter.state.value !== null) {
                params.push(`${encodeURIComponent(filter.paramName)}=${encodeURIComponent(filter.state.value)}`);
            }
        });

        // Add search query if it exists
        if (searchQuery && searchQuery.trim() !== '') {
            params.push(`search=${encodeURIComponent(searchQuery.trim())}`);
        }

        setShipmentsFetchUrl(`${import.meta.env.VITE_BACKEND_URL}/shipments${params.length > 0 ? "?" : ""}${params.join('&')}`)
    }

    const fetchData = async () => {
        if (isLoading) {
            return
        }

        setIsLoading(true)

        try {
            const response: Response = await fetchWithAuth(shipmentFetchUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })

            if (!response.ok) {
                throw new Error("Failed to fetch minimum in-stock counts")
            }

            const data: ShipmentsResponse = await response.json()
            setShipments(data.data)
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRowClick = (productId: number) => {
        navigate(`/shipments/${productId}`);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        // URL rebuild and data fetch will be handled by useEffect hooks
    };

    const handleFilterChange = (filterTitle: string, value: string | number) => {
        const updatedFilters = filters.map(filter => {
            if (filter.title === filterTitle) {
                return {
                    ...filter,
                    state: {
                        value: value,
                        label: value.toString()
                    }
                };
            }
            return filter;
        });

        setFilters(updatedFilters);
        // URL rebuild and data fetch will be handled by useEffect hooks
    };

    // Rebuild URL when filters or search query change
    useEffect(() => {
        buildFetchUrl();
    }, [filters, searchQuery]);

    // Fetch data when URL changes
    useEffect(() => {
        if (shipmentFetchUrl) {
            fetchData();
        }
    }, [shipmentFetchUrl]);

    // Initial fetch
    useEffect(() => {
        buildFetchUrl();
    }, []);

    return(
        <div className={styles.productsPage}>
            {isLoading && (
                <div className={styles.loaderContainer}>
                    <Loader size="large" />
                </div>
            )}
            <NavBar page={"shipments"} current={"shipments"}/>
            <div className={styles.pageContent}>
                <FiltersAndSearchBar
                    filters={filters}
                    onSearch={handleSearchChange}
                    onFilterChange={handleFilterChange}
                />
                <div className={styles.tableContainer}>
                    <table className={styles.valuesTable}>
                        <thead>
                            <tr>
                                <th>Тип</th>
                                <th>Товар</th>
                                <th>Кол-ва товара</th>
                                <th>Дата</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                shipments.map((item: Shipment, index: number) => (
                                    <tr
                                        className={styles.valuesTableRow}
                                        key={index}
                                        onClick={() => handleRowClick(item.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td className={styles.valuesTableCell}>{item.type}</td>
                                        <td className={styles.valuesTableCell}>{item.product.name}</td>
                                        <td className={styles.valuesTableCell}>{item.quantity}</td>
                                        <td className={styles.valuesTableCell}>{dayjs(item.date).format("DD-MM-YYYY")}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
