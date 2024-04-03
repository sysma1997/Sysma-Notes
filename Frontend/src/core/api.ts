type Method = "GET" | "POST" | "PUT" | "REMOVE";

class ApiResponse {
    constructor(readonly status: number, readonly result: string) { }

    toString() {
        return JSON.stringify({
            status: this.status,
            result: this.result
        });
    }
}
class Api {
    
    static async Init(method: Method, api: string, body?: any, action?: (response: ApiResponse) => void) {
        let headers: HeadersInit = {
            "Accept": "*/*",
            "Content-Type": "application/json; charset=utf-8;"
        };
        const token = window.localStorage.getItem("token");
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await fetch(`/api/${api}`, {
            method: method,
            headers: headers,
            body: (body) ? JSON.stringify(body) : null
        });

        const status = response.status;
        const result = await response.text();
        const res = new ApiResponse(status, result);

        if (action) action(res);

        return res;
    }
}

export { Api, ApiResponse };