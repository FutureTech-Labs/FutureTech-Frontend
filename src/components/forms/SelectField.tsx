import { Label } from '../ui/label'
import { Controller } from 'react-hook-form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const SelectField = ({
    name,
    label,
    placeholder,
    options,
    control,
    error,
    required = false,
    value,
    onChange,
    width,
    className,
    iconColor = "text-white"
}: ISelectFieldProps) => {
    const selectElement = (selectedValue: string, onValueChange: (value: string) => void) => (
        <Select value={selectedValue} onValueChange={onValueChange}>
            <SelectTrigger iconColor={iconColor} className={`disable-rings w-full px-3 h-10! rounded-xl cursor-pointer ${className}`}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className='text-white mt-1'>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )

    return (
        <div className={`space-y-2 w-full ${width}`}>
            {label && (
                <Label htmlFor={name} className='text-sm font-medium text-gray-400'>
                    {label}
                </Label>
            )}

            {control && name ? (
                <Controller
                    name={name}
                    control={control}
                    rules={{
                        required: required ? `Please select a ${label?.toLowerCase()}` : false,
                    }}
                    render={({ field }) =>
                        selectElement(field.value, field.onChange)
                    }
                />
            ) : (
                selectElement(value ?? "", onChange ?? (() => { }))
            )}

            {error && <p className='text-sm text-error-500'>{error.message}</p>}
        </div>
    )
}

export default SelectField
