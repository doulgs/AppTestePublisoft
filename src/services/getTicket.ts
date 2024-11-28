import { ApiQuickPaySoft } from ".";
import { getToken } from "./getToken";

type ResultData = {
  ID: number;
  base64: string;
};

type ResponseResult = {
  IsValid: boolean;
  Message: string;
  Data: ResultData[];
};

async function getTicket() {
  const token = await getToken();

  const requestData = {
    siteName: "qps",
    NomeUsuario: "admin",
    SenhaUsuario: "21232F297A57A5A743894A0E4A801FC3",
    Handle: "15528",
    UUID: "2631b8e8334965cf",
    DataReimpressao: "2021-02-26 16:30:45.000",
  };

  const response = await ApiQuickPaySoft.post<ResponseResult>("/pbl/smart/ReeimprimirTicketTeste", requestData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
}

export { getTicket };
