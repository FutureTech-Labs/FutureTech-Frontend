export { };

declare global {

    interface ISignInFormData {
        email: string;
        password: string;
    };

    interface IForgotPasswordForm {
        email: string;
        otp: string;
        newPassword: string;
        confirmPassword: string;
    };

    type IFormInputProps = {
        name: string;
        label?: string;
        placeholder: string;
        type?: string;
        register: UseFormRegister;
        error?: FieldError;
        validation?: RegisterOptions;
        disabled?: boolean;
        value?: string;
        autoComplete?: string;
    };

    type ISelectFieldProps = {
        name: string;
        label: string;
        placeholder: string;
        options: readonly Option[];
        control: Control;
        error?: FieldError;
        required?: boolean;
    };

}