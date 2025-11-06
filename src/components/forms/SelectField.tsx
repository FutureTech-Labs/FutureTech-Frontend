import { Label } from '../ui/label'
import { Controller } from 'react-hook-form'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const SelectField = ({ name, label, placeholder, options, control, error, required = false }: ISelectFieldProps) => {
    return (
        <div className='space-y-2'>
            <Label htmlFor={name} className='text-sm font-medium text-gray-400'>
                {label}
            </Label>

            <Controller
                name={name}
                control={control}
                rules={{
                    required: required ? `Please select a ${label.toLowerCase()}` : false,
                }}
                render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full h-12! px-3 py-3 text-base border-gray-600 bg-gray-800 text-white rounded-lg">
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent className='bg-gray-800 border-gray-600 text-white'>
                            {options.map((option) => (
                                <SelectItem value={option.value} key={option.value} className="focus:bg-gray-600 focus:text-white">
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                        {error && <p className='text-sm text-error-500'>{error.message}</p>}
                    </Select>
                )}
            />
        </div>
    )
}

export default SelectField;