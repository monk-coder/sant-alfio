import React, {type ChangeEvent, useContext, useEffect, useState} from "react";
import styles from './ShipmentCreate.module.css';
import NavBar from "@components/sm/NavBar.tsx";
import {useNavigate} from "react-router-dom";
import type {Product} from "@types/Products.ts";
import AuthContext, {type AuthContextType} from "@context/AuthContext.tsx";
import {TextInput} from "@ui/inputs/TextInput.tsx";
import {SubmitButton} from "@ui/buttons/SubmitButton.tsx";
import type {ShipmentTypesResponse, ProductsResponse} from "@types/Responses.ts";
import type {Shipment} from "@types/Shipments.ts";
import type {FilterOption} from "@types/Filters.ts";
import dayjs from "dayjs";

// Add all controlled states for the shipment
export const ShipmentCreate: React.FC = (): React.ReactElement => {
    const {user, isLoading, setIsLoading} = useContext(AuthContext) as AuthContextType;

    const [shipmentTypes, setShipmentTypes] = useState<FilterOption[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedType, setSelectedType] = useState<string>("");
    const [selectedProduct, setSelectedProduct] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(0);
    const [date, setDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
    const [comment, setComment] = useState<string>("");

    const navigate = useNavigate();

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
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/shipments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify(shipmentData)
            });
            if (!response.ok) {
                throw new Error("Failed to create shipment");
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
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/shipment-types`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
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
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/products`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
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
    }, []);

    return (
        <div className={styles.shipmentCreatePage}>
            <NavBar page={"shipments"} current={"shipments/create"} />
            <form className={styles.creationForm} onSubmit={handleSubmit}>
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
