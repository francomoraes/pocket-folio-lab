import { API_ENDPOINTS } from "@/config/api";
import { api } from "@/lib/axios";

interface CsvUploadResponse {
  message: string;
  autoCreated: {
    institutions: string[];
    assetClasses: string[];
    assetTypes: string[];
  };
}

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

  async uploadCsv(file: File): Promise<CsvUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post<CsvUploadResponse>(
      API_ENDPOINTS.csv.upload,
      formData,
    );
    return response.data;
  }
}

export const csvService = new CsvService();
