"use client";
import { forwardRef } from "react";

const inputCls =
  "w-full py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-sm";

export const FormInput = forwardRef(function FormInput(
  { label, leftIcon: LeftIcon, rightElement, wrapperClassName = "", ...props },
  ref,
) {
  return (
    <div className={wrapperClassName}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {LeftIcon && (
          <LeftIcon
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
          />
        )}
        <input
          ref={ref}
          className={`${inputCls} ${LeftIcon ? "pl-10" : "pl-4"} ${rightElement ? "pr-11" : "pr-4"}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
    </div>
  );
});
