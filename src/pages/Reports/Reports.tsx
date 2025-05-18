import React, {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@components/sm/Navbar.tsx";
import FiltersAndSearchBar from "@components/md/FiltersAndSearchBar.tsx";
import type {Filter, FilterOption} from "@types/Filters.ts";
import AuthContext, {type AuthContextType} from "@context/AuthContext.tsx";
import type {ReportsResponse} from "@types/Responses.ts";
import Loader from "@components/UI/loader";
import styles from "./Reports.module.css";
import type {Report} from "@types/Reports.ts";
import dayjs from "dayjs";
import { useApi } from "@utils/api";


export const Reports: React.FC = (): React.ReactElement => {
    const {isLoading, setIsLoading} = useContext(AuthContext) as AuthContextType
    const navigate = useNavigate();
    const { fetchWithAuth } = useApi();

    const [filters, setFilters] = useState<Filter[]>([]);
    const [reportFetchUrl, setReportFetchUrl] = useState<string>("")
    const [reports, setReports] = useState<Report[]>([])
    const [searchQuery, setSearchQuery] = useState<string>("")

    useEffect(() => {
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
            }
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

        setReportFetchUrl(`${import.meta.env.VITE_BACKEND_URL}/export${params.length > 0 ? "?" : ""}${params.join('&')}`)
    }

    const fetchData = async () => {
        if (isLoading) {
            return
        }

        setIsLoading(true)

        try {
            const response: Response = await fetchWithAuth(reportFetchUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })

            if (!response.ok) {
                throw new Error("Failed to fetch reports")
            }

            const data: ReportsResponse = await response.json()
            setReports(data)
            console.log(data)
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRowClick = (reportId: string) => {
        navigate(`/reports/${reportId}`);
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
        if (reportFetchUrl) {
            fetchData();
        }
    }, [reportFetchUrl]);

    // Initial fetch
    useEffect(() => {
        buildFetchUrl();
    }, []);

    return(
        <div className={styles.reportsPage}>
            {isLoading && (
                <div className={styles.loaderContainer}>
                    <Loader size="large" />
                </div>
            )}
            <NavBar page={"reports"} current={"reports"}/>
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
                                <th>Файл</th>
                                <th>Дата</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                reports.map((item: Report) => (
                                    <tr
                                        className={styles.valuesTableRow}
                                        key={item.id}
                                        onClick={() => handleRowClick(item.file)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td className={styles.valuesTableCell}>{item.name}</td>
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
