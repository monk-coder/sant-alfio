import React, {type ChangeEvent, useContext, useEffect, useState} from "react";
import styles from './ShipmentEdit.module.css';
import NavBar from "@components/sm/NavBar.tsx";
import {useNavigate, useParams} from "react-router-dom";
import type {Product} from "@types/Products.ts";
import AuthContext, {type AuthContextType} from "@context/AuthContext.tsx";
import {TextInput} from "@ui/inputs/TextInput.tsx";
import {SubmitButton} from "@ui/buttons/SubmitButton.tsx";
import type {ShipmentTypesResponse, ProductsResponse} from "@types/Responses.ts";
import Loader from "@components/UI/loader";
import type {FilterOption} from "@types/Filters.ts";
import dayjs from "dayjs";
import {useApi} from "@utils/api.ts";

export const ShipmentEdit: React.FC = (): React.ReactElement => {
    const {isLoading, setIsLoading} = useContext(AuthContext) as AuthContextType;
    const {id} = useParams<{id: string}>();

    const { fetchWithAuth } = useApi();

    const [shipmentTypes, setShipmentTypes] = useState<FilterOption[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedType, setSelectedType] = useState<string>("");
    const [selectedProduct, setSelectedProduct] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(0);
    const [date, setDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
    const [comment, setComment] = useState<string>("");

    const navigate = useNavigate();

    const fetchShipment = async () => {
        setIsLoading(true);
        try {
            const response = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}/shipments/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch shipment");
            }

            const responseData = await response.json();
            const shipmentData = responseData.data || responseData;

            setSelectedType(shipmentData.type);
            setSelectedProduct(shipmentData.product.id.toString());
            setQuantity(shipmentData.quantity);
            setDate(dayjs(shipmentData.date).format("YYYY-MM-DD"));
            if (shipmentData.comment) {
                setComment(shipmentData.comment);
            }
        } catch (error) {
            console.error(error);
            navigate("/shipments");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        const shipmentData = {
            type: selectedType,
            product_id: selectedProduct,
            quantity,
            date,
            comment,
        };

        try {
            const response = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}/shipments/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(shipmentData)
            });
            if (!response.ok) {
                throw new Error("Failed to update shipment");
            }
            navigate("/shipments");
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchShipmentTypes = async () => {
        try {
            const response = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}/shipment-types`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                console.error("Failed to fetch shipment types");
                return;
            }

            const data: ShipmentTypesResponse = await response.json();
            const shipmentTypeOptions = data.data.map((type: string): FilterOption => ({
                value: type,
                label: type
            }));
            setShipmentTypes(shipmentTypeOptions);
        } catch (error) {
            console.error("Error fetching shipment types:", error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}/products`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                console.error("Failed to fetch products");
                return;
            }

            const data: ProductsResponse = await response.json();
            setProducts(data.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchShipmentTypes();
        fetchProducts();
        fetchShipment();
    }, []);

    return (
        <div className={styles.shipmentEditPage}>
            {isLoading && (
                <div className={styles.loaderContainer}>
                    <Loader size="large" />
                </div>
            )}
            <NavBar page={"shipments"} current={"shipments"} />
            <form className={styles.editForm} onSubmit={handleSubmit}>
                <select
                    className={styles.select}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedType(e.target.value)}
                    value={selectedType}
                >
                    <option value="" disabled>Тип отгрузки</option>
                    {shipmentTypes.map((type: FilterOption, index: number) => (
                        <option key={index} value={type.value.toString()}>
                            {type.label}
                        </option>
                    ))}
                </select>
                <select
                    className={styles.select}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedProduct(e.target.value)}
                    value={selectedProduct}
                >
                    <option value="" disabled>Товар</option>
                    {products.map((product: Product) => (
                        <option key={product.id} value={product.id.toString()}>
                            {product.name}
                        </option>
                    ))}
                </select>
                <TextInput
                    className={styles.textInput}
                    placeholder={"Количество"}
                    value={quantity}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setQuantity(Number(e.target.value))}
                />
                <TextInput
                    className={styles.textInput}
                    type="date"
                    placeholder={"Дата"}
                    value={date}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                />
                <TextInput
                    className={styles.textInput}
                    placeholder={"Комментарий"}
                    value={comment}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setComment(e.target.value)}
                />
                <SubmitButton value={"Сохранить"} disabled={isLoading} />
            </form>
        </div>
    );
};
