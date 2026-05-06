import { useState } from "react";
import { createGuest } from "../services/api";

export default function GuestFormPage() {
  const [form, setForm] = useState({
    name: "",
    purpose: "",
    id_card_number: "",
    host_name: "",
  });
  const [idCardImage, setIdCardImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("purpose", form.purpose);
      formData.append("id_card_number", form.id_card_number);
      formData.append("host_name", form.host_name);
      if (idCardImage) {
        formData.append("id_card_image", idCardImage);
      }

      await createGuest(formData);
      setSuccess(true);
      setForm({ name: "", purpose: "", id_card_number: "", host_name: "" });
      setIdCardImage(null);
    } catch (err) {
      setError("Gagal registrasi tamu. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">Registrasi Tamu</h1>

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Tamu berhasil diregistrasi!
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama Tamu</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tujuan Kunjungan</label>
          <input
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nomor ID Card</label>
          <input
            name="id_card_number"
            value={form.id_card_number}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nama Host</label>
          <input
            name="host_name"
            value={form.host_name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Foto ID Card</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setIdCardImage(e.target.files?.[0] || null)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Registrasi"}
        </button>
      </form>
    </div>
  );
}