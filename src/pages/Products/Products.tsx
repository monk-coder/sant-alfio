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

const mockProducts: Product[] = [
    {
        id: 1,
        name: "Product 1",
        category: "Category 1",
        inStockCount: 10,
        units: "psc",
    },
    {
        id: 2,
        name: "Product 2",
        category: "Category 2",
        inStockCount: 10,
        units: "psc",
    },
    {
        id: 3,
        name: "Product 3",
        category: "Category 3",
        inStockCount: 10,
        units: "psc",
    },
    {
        id: 4,
        name: "Product 4",
        category: "Category 4",
        inStockCount: 10,
        units: "psc",
    },
]

export const Products: React.FC = (): React.ReactElement => {
    const {user, isLoading, setIsLoading} = useContext(AuthContext) as AuthContextType
    const navigate = useNavigate();

    const [filters, setFilters] = useState<Filter[]>([]);
    const [categories, setCategories] = useState<FilterOption[]>([])
    const [leftCounts, setLeftCounts] = useState<FilterOption[]>([])
    const [productFetchUrl, setProductFetchUrl] = useState<string>("")
    const [products, setProducts] = useState<Product[]>([])

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
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/categories`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            }
        })

        if (!response.ok) {
            console.error("Failed to fetch categories")
            return
        }

        const data: CategoriesResponse = await response.json()
        const categories: FilterOption = data.data.map((category: Category): FilterOption => ({
            value: category.id,
            label: category.name
        }))
        setCategories(categories)
    }

    const fetchLeftCounts = async () => {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/categories`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            }
        })

        if (!response.ok) {
            console.error("Failed to fetch minimum in-stock counts")
            return
        }

        const data: LeftCountResponse = await response.json()
        const leftCounts: FilterOption = data.data.map((leftAmount: number): FilterOption => ({
            value: leftAmount,
            label: leftAmount
        }))

        setLeftCounts(leftCounts)
    }

    useEffect(() => {
        fetchCategories()
        fetchLeftCounts()

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
    }, []);

    const buildFetchUrl = async () => {
        const params: string[] = [];

        filters.forEach(filter => {
            if (filter.state !== undefined && filter.state.value !== '' && filter.state.value !== null) {
                params.push(`${encodeURIComponent(filter.paramName)}=${encodeURIComponent(filter.state.value)}`);
            }
        });

        setProductFetchUrl(`${import.meta.env.VITE_BACKEND_URL}/products${params.length > 0 ? "?" : ""}${params.join('&')}`)
    }

    const fetchData = async () => {
        if (isLoading) {
            return
        }

        setIsLoading(true)
        // const response: Response = await fetch(productFetchUrl, {
        //     method: "GET",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Authorization": `Bearer ${user.token}`
        //     }
        // })
        //
        // if (!response.ok) {
        //     console.error("Failed to fetch minimum in-stock counts")
        //     return
        // }
        //
        // const data: ProductsResponse = await response.json()
        // setProducts(data.data)
        setProducts(mockProducts)
        setIsLoading(false)
    }

    const handleRowClick = (productId: number) => {
        navigate(`/products/${productId}`);
    };

    useEffect(() => {
        buildFetchUrl()
        fetchData()
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
                    onSearch={fetchData}
                    onFilterChange={fetchData}
                />
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
                                    <td className={styles.valuesTableCell}>{item.category}</td>
                                    <td className={styles.valuesTableCell}>{`${item.inStockCount} (${item.units})`}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
