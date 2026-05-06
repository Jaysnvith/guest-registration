import { useEffect, useState } from "react";
import { getGuests, checkoutGuest } from "../services/api";
import type { Guest } from "../services/api";

export default function GuestListPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchGuests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getGuests(status);
      setGuests(res.data);
    } catch {
      setError("Gagal mengambil data tamu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, [status]);

  const handleCheckout = async (id: number) => {
    try {
      await checkoutGuest(id);
      fetchGuests();
    } catch {
      alert("Gagal checkout tamu.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6">Daftar Tamu</h1>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setStatus("")}
          className={`px-4 py-2 rounded ${status === "" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
        >
          Semua
        </button>
        <button
          onClick={() => setStatus("active")}
          className={`px-4 py-2 rounded ${status === "active" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
        >
          Aktif
        </button>
        <button
          onClick={() => setStatus("checked_out")}
          className={`px-4 py-2 rounded ${status === "checked_out" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
        >
          Sudah Keluar
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* Loading */}
      {loading && <p className="text-gray-500">Memuat data...</p>}

      {/* Table */}
      {!loading && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Nama</th>
                <th className="p-3 border">Tujuan</th>
                <th className="p-3 border">No. ID Card</th>
                <th className="p-3 border">Host</th>
                <th className="p-3 border">Check In</th>
                <th className="p-3 border">Check Out</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {guests.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-3 text-center text-gray-400">
                    Tidak ada data tamu.
                  </td>
                </tr>
              )}
              {guests.map((guest) => (
                <tr key={guest.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{guest.name}</td>
                  <td className="p-3 border">{guest.purpose}</td>
                  <td className="p-3 border">{guest.id_card_number}</td>
                  <td className="p-3 border">{guest.host_name}</td>
                  <td className="p-3 border">
                    {new Date(guest.check_in_at).toLocaleString("id-ID")}
                  </td>
                  <td className="p-3 border">
                    {guest.check_out_at
                      ? new Date(guest.check_out_at).toLocaleString("id-ID")
                      : "-"}
                  </td>
                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        guest.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {guest.status === "active" ? "Aktif" : "Sudah Keluar"}
                    </span>
                  </td>
                  <td className="p-3 border">
                    {guest.status === "active" && (
                      <button
                        onClick={() => handleCheckout(guest.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                      >
                        Checkout
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}