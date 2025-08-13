declare global {
  namespace NodeJS {
    interface ProcessEnv {
      user: string;
      pass: string;
      domain?: string;
      userName?: string;
      passWord?: string;
      accessToken?: string;
    }
  }
}

export {}; 