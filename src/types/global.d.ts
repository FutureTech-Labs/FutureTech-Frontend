import type { UseFormRegister, FieldError, RegisterOptions } from "react-hook-form";

declare global {

    // Auth
    interface ISignInFormData {
        email: string;
        password: string;
    }

    interface IForgotPasswordForm {
        email: string;
        otp: string;
        newPassword: string;
        confirmPassword: string;
    }

    interface IUser {
        id: string;
        name: string;
        email: string;
        role: "admin" | "cashier";
        status: string;
    }

    interface IAuthContextType {
        user: IUser | null;
        loading: boolean;
        logout: () => Promise<void>;
        refreshUser: () => Promise<void>;
    }

    interface ISidebarProps {
        user: IUser;
    }

    interface ISidebarContentProps {
        user: IUser;
        isCollapsed?: boolean;
    }

    // Product Interfaces
    interface IProduct {
        _id: string;
        name: string;
        brand: Brand;
        description: Description;
        category: Category;
        sellingPrice: number;
        warrantyPeriod: string;
        images: string[];
        status: string;
        createdAt: string;
        updatedAt: string;
    }

    interface Description {
        intro: string;
        specifications: string[];
    }

    interface Category {
        _id: string;
        name: string;
        count?: number;
    }

    interface Brand {
        _id: string;
        name: string;
        count?: number;
    }

    // Supplier Invoice (purchaseHistory)
    interface IPurchaseInvoiceRef {
        _id: string;
        invoiceNumber?: string;
        totalAmount?: number;
        status?: "pending" | "paid";
        date?: string;
    }

    // Supplier Payment
    interface ISupplierPayment {
        _id: string;
        amount: number;
        paymentMethod: "cash" | "online_transfer";
        datePaid: string;
        notes?: string;
        appliedInvoices: {
            invoice: {
                _id: string;
                invoiceNumber?: string;
                totalAmount?: number;
                status?: string;
            };
            amount: number;
        }[];
    }

    // Supplier
    interface ISupplier {
        _id: string;
        name: string;
        contact: string;
        email: string;
        company: string;
        address: string;
        status: "pending" | "paid"; // ✔ correct enum
        paymentTerms: "COD" | "Net 15" | "Net 30" | "Net 45";
        bankDetails: BankDetails;
        outstandingBalance: number;
        purchaseHistory: IPurchaseInvoiceRef[];
        payments?: ISupplierPayment[];
        createdAt: string;
        updatedAt: string;
    }

    interface BankDetails {
        bankName: string;
        accountNumber: string;
    }

    // Inputs
    type IFormInputProps = {
        name: string;
        label?: string;
        placeholder: string;
        type?: string;
        register: UseFormRegister<any>;
        error?: FieldError;
        validation?: RegisterOptions;
        disabled?: boolean;
        value?: string;
        autoComplete?: string;
    };

    // Textarea
    type IFormTextareaProps = {
        name: string;
        label?: string;
        placeholder: string;
        register: UseFormRegister<any>;
        error?: FieldError;
        validation?: RegisterOptions;
        disabled?: boolean;
        value?: string;
        rows?: number;
        maxWords?: number;
    };

    // Select
    type ISelectFieldProps = {
        name?: string;
        label?: string;
        placeholder?: string;
        options: Option[];
        control?: any;
        error?: any;
        required?: boolean;
        value?: string;
        className?: string;
        iconColor?: string;
        width?: string;
        disabled?: boolean;
        onChange?: (value: string) => void;
    };

    type Option = {
        value: string;
        label: string;
    };
}

export { };
