import React from 'react'

import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

const InputField = ({
    name,
    label,
    placeholder,
    type = "text",
    register,
    error,
    validation,
    disabled,
    value,
    autoComplete = "on"
}: IFormInputProps) => {

    return (
        <div className='space-y-2'>

            <Label htmlFor={name} className="text-sm font-medium text-gray-400">
                {label}
            </Label>

            <Input
                type={type}
                id={name}
                placeholder={placeholder}
                disabled={disabled}
                value={value}
                autoComplete={autoComplete}
                className={cn("h-12 text-white text-base placeholder:text-gray-500 border-[0.3px] border-gray-500/20 backdrop-blur-2xl !bg-gray-500/15 rounded-lg",
                    { 'opacity-50 cursor-not-allowed': disabled },
                    error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                )}
                {...register(name, validation)}
            />
            {error && <p className="text-sm text-error-500">{error.message}</p>}
        </div>
    )
}

export default InputField;