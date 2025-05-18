import React, {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@components/sm/Navbar.tsx";
import FiltersAndSearchBar from "@components/md/FiltersAndSearchBar.tsx";
import type {Filter, FilterOption} from "@types/Filters.ts";
import AuthContext, {type AuthContextType} from "@context/AuthContext.tsx";
import type {OperationsResponse} from "@types/Responses.ts";
import Loader from "@components/UI/loader";
import styles from "./Operations.module.css";
import type {Operation} from "../../types/Operations.ts";
import dayjs from "dayjs";
import {useApi} from "@utils/api.ts";


export const Operations: React.FC = (): React.ReactElement => {
    const {user, isLoading, setIsLoading} = useContext(AuthContext) as AuthContextType
    const navigate = useNavigate();
    const { fetchWithAuth } = useApi();

    const [filters, setFilters] = useState<Filter[]>([]);
    const [operationTypes, setOperationTypes] = useState<FilterOption[]>([])
    const [operationFetchUrl, setOperationsFetchUrl] = useState<string>("")
    const [operations, setOperations] = useState<Operation[]>([])
    const [searchQuery, setSearchQuery] = useState<string>("")

    const fetchOperationTypes = async () => {
        try {
            const response = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}/operation-types`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })

            if (!response.ok) {
                throw new Error("Failed to fetch operation types")
            }

            const data = await response.json()
            const operationTypes: FilterOption = data.data.map((operationType: string): FilterOption => ({
                value: operationType,
                label: operationType
            }))
            setOperationTypes(operationTypes)
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        fetchOperationTypes()

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
                paramName: "type",
                options: operationTypes,
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

        setOperationsFetchUrl(`${import.meta.env.VITE_BACKEND_URL}/operations${params.length > 0 ? "?" : ""}${params.join('&')}`)
    }

    const fetchData = async () => {
        if (isLoading) {
            return
        }

        setIsLoading(true)

        try {
            const response: Response = await fetchWithAuth(operationFetchUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })

            if (!response.ok) {
                throw new Error("Failed to fetch operations")
            }

            const data: OperationsResponse = await response.json()
            setOperations(data.data)
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRowClick = (operationId: number) => {
        navigate(`/operations/${operationId}`);
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
        if (operationFetchUrl) {
            fetchData();
        }
    }, [operationFetchUrl]);

    // Initial fetch
    useEffect(() => {
        buildFetchUrl();
    }, []);

    return(
        <div className={styles.operationsPage}>
            {isLoading && (
                <div className={styles.loaderContainer}>
                    <Loader size="large" />
                </div>
            )}
            <NavBar page={"operations"} current={"operations"}/>
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
                                <th>ID</th>
                                <th>Тип</th>
                                <th>Дата</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                operations.map((item: Operation, index: number) => (
                                    <tr
                                        className={styles.valuesTableRow}
                                        key={index}
                                        onClick={() => handleRowClick(item.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td className={styles.valuesTableCell}>{item.id}</td>
                                        <td className={styles.valuesTableCell}>{item.type}</td>
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
