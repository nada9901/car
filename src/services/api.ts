import type { CarFilters, Car, Booking, Payment, DashboardStats, User } from '@/types';

const API_URL = 'http://localhost:3001/api';

function getToken() {
    return localStorage.getItem('token');
}

function getHeaders() {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
}

// Cars API
export async function getCars(filters?: CarFilters): Promise<Car[]> {
    const params = new URLSearchParams();
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
    }
    
    const response = await fetch(`${API_URL}/cars?${params}`, {
        headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch cars');
    return response.json();
}

export async function getCar(id: number): Promise<Car> {
    const response = await fetch(`${API_URL}/cars/${id}`, {
        headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch car');
    return response.json();
}

// Bookings API
export async function createBooking(bookingData: {
    car_id: number;
    start_date: string;
    end_date: string;
}): Promise<Booking> {
    const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(bookingData),
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create booking');
    }
    return response.json();
}

export async function extendBooking(id: number, new_end_date: string): Promise<Booking> {
    const response = await fetch(`${API_URL}/bookings/${id}/extend`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ new_end_date }),
    });
    
    if (!response.ok) throw new Error('Failed to extend booking');
    return response.json();
}

export async function getMyBookings(): Promise<Booking[]> {
    const response = await fetch(`${API_URL}/bookings/my`, {
        headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return response.json();
}

// Payments API
export async function createPayment(paymentData: FormData): Promise<Payment> {
    const token = getToken();
    const response = await fetch(`${API_URL}/payments`, {
        method: 'POST',
        headers: {
            ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: paymentData,
    });
    
    if (!response.ok) throw new Error('Failed to create payment');
    return response.json();
}

export async function getMyPayments(): Promise<Payment[]> {
    const response = await fetch(`${API_URL}/payments/my`, {
        headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch payments');
    return response.json();
}

// Admin API
export async function getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${API_URL}/admin/dashboard-stats`, {
        headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
}

export async function getAllBookings(): Promise<Booking[]> {
    const response = await fetch(`${API_URL}/admin/bookings`, {
        headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return response.json();
}

export async function updateBookingStatus(id: number, status: string): Promise<Booking> {
    const response = await fetch(`${API_URL}/admin/bookings/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
    });
    
    if (!response.ok) throw new Error('Failed to update booking');
    return response.json();
}

export async function getAllPayments(): Promise<Payment[]> {
    const response = await fetch(`${API_URL}/admin/payments`, {
        headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch payments');
    return response.json();
}

export async function verifyPayment(id: number): Promise<Payment> {
    const response = await fetch(`${API_URL}/admin/payments/${id}/verify`, {
        method: 'PUT',
        headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to verify payment');
    return response.json();
}

export async function addCar(carData: FormData): Promise<Car> {
    const token = getToken();
    const response = await fetch(`${API_URL}/admin/cars`, {
        method: 'POST',
        headers: {
            ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: carData,
    });
    
    if (!response.ok) throw new Error('Failed to add car');
    return response.json();
}

export async function updateCar(id: number, carData: FormData): Promise<Car> {
    const token = getToken();
    const response = await fetch(`${API_URL}/admin/cars/${id}`, {
        method: 'PUT',
        headers: {
            ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: carData,
    });
    
    if (!response.ok) throw new Error('Failed to update car');
    return response.json();
}

export async function deleteCar(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/admin/cars/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to delete car');
}

export async function getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_URL}/admin/users`, {
        headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
}
