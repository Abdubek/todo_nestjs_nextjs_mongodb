export interface Token {
  accessToken: string;
  refreshToken: string;
}

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

const API_URL = "http://localhost:3000/api";
const REFRESH_TOKEN_URL = API_URL + "/auth/refresh";
const LOGIN_PAGE_URL = "/sign-in";

class Api {
  private static instance: Api;
  private isRefreshing = false;
  private failedQueue: { resolve: any; reject: any }[] = [];
  private url;

  constructor(url: string) {
    this.url = url;
  }

  public static getInstance(url: string): Api {
    if (!Api.instance) {
      Api.instance = new Api(url);
    }

    return Api.instance;
  }

  async request(module: string, init?: RequestInit): Promise<any> {
    return fetch(this.url + module, this.getFetchConfig(init)).then((res) => {
      if (res.status === 401) {
        return this.tryRefresh(module, init);
      }
      return res.json();
    });
  }

  private async tryRefresh(module: string, init?: RequestInit) {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return this.request(module, init);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    return new Promise((resolve) => {
      this.refreshToken().then(() => {
        this.processQueue();
        this.request(module, init).then((res) => resolve(res));
      });
    });
  }

  private async refreshToken(): Promise<any> {
    if (this.isRefreshing) {
      return;
    }
    this.isRefreshing = true;

    await fetch(REFRESH_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: this.getToken().refreshToken }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode && data.statusCode !== 201) {
          this.removeToken();
          if (typeof window !== "undefined") {
            window.location.href = LOGIN_PAGE_URL;
          }
          return;
        }

        this.saveToken(data);
        this.isRefreshing = false;
      });
  }

  private processQueue(error?: any) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve();
      }
    });

    this.failedQueue = [];
  }

  private getFetchConfig(init?: RequestInit) {
    return {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: "Bearer " + this.getToken().accessToken,
        "Content-Type": "application/json",
      },
    };
  }

  private getToken(): Token {
    return {
      accessToken: getLocalStorage().getItem(ACCESS_TOKEN_KEY) || "",
      refreshToken: getLocalStorage().getItem(REFRESH_TOKEN_KEY) || "",
    };
  }

  saveToken(token: Token) {
    getLocalStorage().setItem(ACCESS_TOKEN_KEY, token.accessToken);
    getLocalStorage().setItem(REFRESH_TOKEN_KEY, token.refreshToken);
  }

  private removeToken() {
    getLocalStorage().removeItem(ACCESS_TOKEN_KEY);
    getLocalStorage().removeItem(REFRESH_TOKEN_KEY);
  }
}

const getLocalStorage = () => {
  if (typeof window !== "undefined") {
    return localStorage;
  }
  return {
    getItem(key: string) {},
    setItem(key: string, value: string) {},
    removeItem(key: string) {},
  };
};

export default Api.getInstance(API_URL);
