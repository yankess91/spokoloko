import ApiClient from './ApiClient';
import AppointmentsApi from './AppointmentsApi';
import ClientsApi from './ClientsApi';
import ProductsApi from './ProductsApi';
import ServicesApi from './ServicesApi';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

const apiClient = new ApiClient(API_BASE);

export const appointmentsApi = new AppointmentsApi(apiClient);
export const clientsApi = new ClientsApi(apiClient);
export const productsApi = new ProductsApi(apiClient);
export const servicesApi = new ServicesApi(apiClient);
