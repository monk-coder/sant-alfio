import React, {type ChangeEvent, useEffect, useRef, useState} from 'react';
import classes from './TextInput.module.css'
import { type TextInputProps, type TextAreaInputProps } from "../../../types/UI/Inputs.ts";

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
    return (
        <input
            ref={ref}
            className={classes.textInput}
            placeholder={props.placeholder}
            style={{
                "width" : props.width,
                "textAlign" : props.text_align,
                "fontSize" : props.font_size
            }}
             {...props}
        />
    );
})

export const TextAreaInput = React.forwardRef<HTMLTextAreaElement, TextAreaInputProps>((props, ref) => {
    const [currentValue, setCurrentValue ] = useState("");// you can manage data with it

    useEffect(() => {
        if (ref && 'current' in ref && ref.current) {
            ref.current.style.height = "100%";
            const scrollHeight: number = ref.current.scrollHeight;
            ref.current.style.height = scrollHeight + "px";
        }
    }, [currentValue]);

    return (
        <textarea
            ref={ref}
            className={classes.textAreaInput}
            placeholder={props.placeholder}
            wrap={props.wrap ? props.wrap : "soft"}
            maxLength={props.maxLength ? props.maxLength : 1000}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>)=>{setCurrentValue(e.target.value);}}
             {...props}
        />
    );
})

export const PasswordInput = React.forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
    return (
        <input
            ref={ref}
            className={classes.passwordInput}
            type={"password"}
            placeholder={props.placeholder}
            style={{
                "width" : props.width,
                "textAlign" : props.text_align,
                "fontSize" : props.font_size
            }}
             {...props}
        />
    );
})