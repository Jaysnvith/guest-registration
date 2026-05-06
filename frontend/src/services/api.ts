import axios from "axios";

export interface Guest {
  id: number;
  name: string;
  purpose: string;
  id_card_number: string;
  id_card_image: string;
  host_name: string;
  check_in_at: string;
  check_out_at: string | null;
  status: string;
}

export interface CreateGuestRequest {
  name: string;
  purpose: string;
  id_card_number: string;
  host_name: string;
}

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const createGuest = (formData: FormData) =>
  api.post<Guest>("/guests", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getGuests = (status: string = "") =>
  api.get<Guest[]>("/guests", { params: { status } });

export const getGuestByID = (id: number) =>
  api.get<Guest>(`/guests/${id}`);

export const checkoutGuest = (id: number) =>
  api.put<Guest>(`/guests/${id}/checkout`);