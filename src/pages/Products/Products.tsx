import React, {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@components/sm/Navbar.tsx";
import FiltersAndSearchBar from "@components/md/FiltersAndSearchBar.tsx";
import styles from "./Products.module.css";
import type {Filter, FilterOption} from "@types/Filters.ts";
import AuthContext, {type AuthContextType} from "@context/AuthContext.tsx";
import type {CategoriesResponse, LeftCountResponse, ProductsResponse} from "@types/Responses.ts";
import type {Category} from "@types/Categories.ts";
import type {Product} from "@types/Products.ts";
import Loader from "@components/UI/loader";
import {useApi} from "@utils/api.ts";

export const Products: React.FC = (): React.ReactElement => {
    const {user, isLoading, setIsLoading} = useContext(AuthContext) as AuthContextType

    const navigate = useNavigate();
    const { fetchWithAuth } = useApi();

    const [filters, setFilters] = useState<Filter[]>([]);
    const [categories, setCategories] = useState<FilterOption[]>([])
    const [leftCounts, setLeftCounts] = useState<FilterOption[]>([])
    const [productFetchUrl, setProductFetchUrl] = useState<string>("")
    const [products, setProducts] = useState<Product[]>([])
    const [searchQuery, setSearchQuery] = useState<string>("")

    const availabilityTypes: FilterOption[] = [
        {
            value: 0,
            label: "Все"
        },
        {
            value: 1,
            label: "В наличие"
        },
        {
            value: 2,
            label: "Отсутствует"
        }
    ];

    const fetchCategories = async () => {
        try {
            const response = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}/categories/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })

            if (!response.ok) {
                throw new Error("Failed to fetch categories")
            }

            const data: CategoriesResponse = await response.json()
            const categories: FilterOption = data.map((category: Category): FilterOption => ({
                value: category.id,
                label: category.name
            }))
            setCategories(categories)
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchLeftCounts = async () => {
        const uniqueCounts = [...new Set(products.map(product => product.current_quantity))]

        const leftCounts: FilterOption[] = uniqueCounts.map((count): FilterOption => ({
            value: count,
            label: count
        }))

        setLeftCounts(leftCounts)
    }

    useEffect(() => {
        fetchCategories()

        const filters: Filter[] = [
            {
                title: "Категории",
                paramName: "category",
                options: categories
            },
            {
                title: "Наличие",
                paramName: "availability",
                options: availabilityTypes
            },
            {
                title: "Минимальный остаток",
                paramName: "stock",
                options: leftCounts
            }
        ]

        setFilters(filters);
    }, [leftCounts]);

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

        setProductFetchUrl(`${import.meta.env.VITE_BACKEND_URL}/products${params.length > 0 ? "?" : ""}${params.join('&')}`)
    }

    const fetchData = async () => {
        if (isLoading) {
            return
        }
        setIsLoading(true)

        try {
            const response: Response = await fetchWithAuth(productFetchUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })

            if (!response.ok) {
                console.error("Failed to fetch minimum in-stock counts")
                return
            }

            const data: ProductsResponse = await response.json()
            setProducts(data)
            await fetchLeftCounts()
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRowClick = (productId: number) => {
        navigate(`/products/${productId}`);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
    };

    const handleFilterChange = (filterTitle: string, value: string | number) => {
        const updatedFilters = filters.map(filter => {
            if (filter.title === filterTitle) {
                const selectedOption = filter.options.find(option => option.value === value);
                return {
                    ...filter,
                    state: selectedOption || { value, label: value.toString() }
                };
            }
            return filter;
        });

        setFilters(updatedFilters);
    };

    useEffect(() => {
        buildFetchUrl();
    }, [filters, searchQuery]);

    useEffect(() => {
        if (productFetchUrl) {
            fetchData();
        }
    }, [productFetchUrl]);

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
            <NavBar page={"products"} current={"products"}/>
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
                                <th>Наименование</th>
                                <th>Категория</th>
                                <th>Остаток</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                products.map((item: Product, index) => (
                                    <tr
                                        className={styles.valuesTableRow}
                                        key={index}
                                        onClick={() => handleRowClick(item.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td className={styles.valuesTableCell}>{item.name}</td>
                                        <td className={styles.valuesTableCell}>{item.category_id.name}</td>
                                        <td className={styles.valuesTableCell}>{item.current_quantity}</td>
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
