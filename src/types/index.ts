export interface User {
    id: number;
    email: string;
    role: 'Admin' | 'Customer';
    full_name: string;
    age?: number;
    national_id_number?: string;
    license_number?: string;
    id_image_url?: string;
    license_image_url?: string;
    created_at: string;
}

export interface Car {
    id: number;
    brand: string;
    model: string;
    size: 'Small' | 'Medium' | 'Large' | 'SUV' | 'Luxury';
    seats: number;
    engine_power: string;
    color: string;
    manufacturing_year: number;
    daily_price: number;
    image_url: string;
    status: 'Available' | 'Reserved' | 'Maintenance';
    rental_status: number;
    branch?: string;
    created_at: string;
}

export interface Booking {
    id: number;
    user_id: number;
    car_id: number;
    start_date: string;
    end_date: string;
    total_days: number;
    total_price: number;
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
    created_at: string;
    // Joined fields
    brand?: string;
    model?: string;
    image_url?: string;
    daily_price?: number;
    full_name?: string;
    email?: string;
}

export interface Payment {
    id: number;
    booking_id: number;
    bank_account_number?: string;
    amount_paid: number;
    transaction_receipt_url?: string;
    status: 'Pending' | 'Verified';
    payment_date: string;
    // Joined fields
    car_id?: number;
    brand?: string;
    model?: string;
    full_name?: string;
    email?: string;
}

export interface Incident {
    id: number;
    booking_id: number;
    description: string;
    incident_image_url?: string;
    reported_at: string;
}

export interface DashboardStats {
    totalRevenue: number;
    activeRentals: number;
    totalBookings: number;
    pendingBookings: number;
    occupancyRate: number;
    popularCars: {
        brand: string;
        model: string;
        rental_count: number;
    }[];
    monthlyRevenue: {
        month: string;
        revenue: number;
    }[];
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (formData: FormData) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

export interface CarFilters {
    size?: string;
    seats?: string;
    min_price?: string;
    max_price?: string;
    availability?: string;
    brand?: string;
}
