import { API_ENDPOINTS } from "@/config/api";
import { api } from "@/lib/axios";

class CsvService {
  async downloadTemplate(): Promise<Blob> {
    const response = await api.get<Blob>(API_ENDPOINTS.csv.downloadTemplate, {
      responseType: "blob",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(response.data);
    a.download = "csv-template.csv";
    a.click();
    URL.revokeObjectURL(a.href);

    return response.data;
  }

  async uploadCsv(file: File): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);
    await api.post(API_ENDPOINTS.csv.upload, formData);
  }
}

export const csvService = new CsvService();
