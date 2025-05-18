import React from "react";

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
    width?: string | number;
    text_align?: React.CSSProperties['textAlign'];
    font_size?: string | number;
}

export interface TextAreaInputProps extends TextInputProps{
    rows?: number;
    cols?: number;
    wrap?: string;
    maxLength?: number;
}