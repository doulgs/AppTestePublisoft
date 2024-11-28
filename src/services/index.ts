import axios from "axios";

const ApiQuickPaySoft = axios.create({
  baseURL: "http://192.168.1.57/Publisoft.QuickPaySoft.Api",

  headers: {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    Origin: "PubliVendas.app",
  },
});

export { ApiQuickPaySoft };
