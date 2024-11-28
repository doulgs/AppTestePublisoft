import { ApiQuickPaySoft } from ".";

type ResponseToken = {
  access_token: string;
  token_type: string;
  expires_in: string;
};

async function getToken(): Promise<string> {
  try {
    const { data: tokenData } = await ApiQuickPaySoft.post<ResponseToken>("/token", {
      grant_type: "password",
      username: "integracao",
      password: "pbl@1991",
    });

    console.log("tokenData.access_token", tokenData.access_token);

    return tokenData.access_token;
  } catch (err) {
    throw new Error(`Erro ao obter token: ${err}`);
  }
}

export { getToken };
