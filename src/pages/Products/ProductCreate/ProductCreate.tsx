import React, {type ChangeEvent, useContext, useEffect, useState} from "react";
import styles from './ProductCreate.module.css';
import NavBar from "@components/sm/NavBar.tsx";
import {useNavigate} from "react-router-dom";
import type {ProductDetail} from "@types/Products.ts";
import AuthContext, {type AuthContextType} from "@context/AuthContext.tsx";
import type {Category} from "@types/Categories.ts";
import {TextInput, TextAreaInput} from "@ui/inputs/TextInput.tsx";
import {SubmitButton} from "@ui/buttons/SubmitButton.tsx";
import type {CategoriesResponse} from "@types/Responses.ts";

// Add all controlled states for the product
export const ProductCreate: React.FC = (): React.ReactElement => {
    const {user, isLoading, setIsLoading} = useContext(AuthContext) as AuthContextType;

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(0);
    const [unit, setUnit] = useState<string>("");
    const [minAmount, setMinAmount] = useState<number>(0);
    const [dimensions, setDimensions] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        const productData = {
            name,
            category_id: selectedCategory,
            quantity,
            unit,
            min_amount: minAmount,
            dimensions,
            description,
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify(productData)
            });
            if (!response.ok) {
                // handle error (show notification or message)
                throw new Error("Failed to create product");
            }
            // Navigate to products page or detail page after successful creation
            navigate("/products");
        } catch (error) {
            // Optionally handle error, e.g. show error notification
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/categories`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            }
        });

        if (!response.ok) {
            console.error("Failed to fetch categories");
            return;
        }

        const data: CategoriesResponse = await response.json();
        setCategories(data.data);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className={styles.productCreatePage}>
            <NavBar page={"products"} current={"products/create"} />
            <form className={styles.creationForm} onSubmit={handleSubmit}>
                <TextInput
                    className={styles.textInput}
                    placeholder={"Наименование"}
                    value={name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                />
                <select
                    className={styles.select}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
                    value={selectedCategory}
                >
                    <option value="" disabled>Категория</option>
                    {categories.map((category: Category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <TextInput
                    className={styles.textInput}
                    placeholder={"Количество на складе"}
                    value={quantity}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setQuantity(Number(e.target.value))}
                />
                <TextInput
                    className={styles.textInput}
                    placeholder={"Единицы измерения"}
                    value={unit}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUnit(e.target.value)}
                />
                <TextInput
                    className={styles.textInput}
                    placeholder={"Минимальный остаток"}
                    value={minAmount}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setMinAmount(Number(e.target.value))}
                />
                <TextInput
                    className={styles.textInput}
                    placeholder={"Размеры"}
                    value={dimensions}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDimensions(e.target.value)}
                />
                <TextAreaInput
                    placeholder={"Описание"}
                    value={description}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                    cols={9}
                />
                <SubmitButton value={"Сохранить"} disabled={isLoading} />
            </form>
        </div>
    );
};