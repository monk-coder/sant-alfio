import React from "react";
import type {ButtonProps} from "../../../types/UI/Buttons.ts";
import classes from './SubmitButton.module.css'

export const SubmitButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return (
      <button
          ref={ref}
          className={classes.submitButton}
          type={"submit"}
          disabled={props.disabled}
          onClick={props.onClick}
          {...props}
      >
          {props.value}
      </button>
  );
});