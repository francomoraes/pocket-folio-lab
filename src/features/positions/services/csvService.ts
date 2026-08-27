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
  async downloadTemplate(investorId?: number): Promise<Blob> {
    const url = investorId
      ? API_ENDPOINTS.managers.clientCsv.downloadTemplate(investorId)
      : API_ENDPOINTS.csv.downloadTemplate;
    const response = await api.get<Blob>(url, {
      responseType: "blob",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(response.data);
    a.download = "csv-template.csv";
    a.click();
    URL.revokeObjectURL(a.href);

    return response.data;
  }

  async uploadCsv(file: File, investorId?: number): Promise<CsvUploadResponse> {
    const url = investorId
      ? API_ENDPOINTS.managers.clientCsv.upload(investorId)
      : API_ENDPOINTS.csv.upload;
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post<CsvUploadResponse>(url, formData);
    return response.data;
  }
}

export const csvService = new CsvService();
