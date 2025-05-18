import React, {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@components/sm/Navbar.tsx";
import FiltersAndSearchBar from "@components/md/FiltersAndSearchBar.tsx";
import type {Filter, FilterOption} from "@types/Filters.ts";
import AuthContext, {type AuthContextType} from "@context/AuthContext.tsx";
import type {ReportsResponse} from "@types/Responses.ts";
import Loader from "@components/UI/loader";
import styles from "./Reports.module.css";
import type {Report} from "../../types/Reports.ts";
import dayjs from "dayjs";


export const Reports: React.FC = (): React.ReactElement => {
    const {user, isLoading, setIsLoading} = useContext(AuthContext) as AuthContextType
    const navigate = useNavigate();

    const [filters, setFilters] = useState<Filter[]>([]);
    const [reportFetchUrl, setReportFetchUrl] = useState<string>("")
    const [reports, setReports] = useState<Report[]>([])

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

    const buildFetchUrl = async () => {
        const params: string[] = [];

        filters.forEach(filter => {
            if (filter.state !== undefined && filter.state.value !== '' && filter.state.value !== null) {
                params.push(`${encodeURIComponent(filter.paramName)}=${encodeURIComponent(filter.state.value)}`);
            }
        });

        setReportFetchUrl(`${import.meta.env.VITE_BACKEND_URL}/reports${params.length > 0 ? "?" : ""}${params.join('&')}`)
    }

    const fetchData = async () => {
        if (isLoading) {
            return
        }

        setIsLoading(true)

        try {
            const response: Response = await fetch(reportFetchUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                }
            })

            if (!response.ok) {
                throw new Error("Failed to fetch reports")
            }

            const data: ReportsResponse = await response.json()
            setReports(data.data)
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRowClick = (reportId: string) => {
        navigate(`/reports/${reportId}`);
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
        buildFetchUrl();
        fetchData();
    };

    useEffect(() => {
        buildFetchUrl()
        fetchData()
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
                    onSearch={fetchData}
                    onFilterChange={handleFilterChange}
                />
                <table className={styles.valuesTable}>
                    <thead>
                        <tr>
                            <th>Файл</th>
                            <th>Дата</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            reports.map((item: Report, index: number) => (
                                <tr
                                    className={styles.valuesTableRow}
                                    key={index}
                                    onClick={() => handleRowClick(item.file)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td className={styles.valuesTableCell}>{item.file}</td>
                                    <td className={styles.valuesTableCell}>{dayjs(item.date).format("DD-MM-YYYY")}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}