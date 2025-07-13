export interface LoginResponse {
  _id: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  pendingPayment: number;
  isAdmin: boolean;
  isRider: boolean;
  onDuty: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

class AuthService {
  private baseURL = 'https://15.207.211.78.nip.io/api';

  private getHeaders(): Headers {
    const headers = new Headers();
    headers.append("accept", "application/json, text/plain, */*");
    headers.append("accept-language", "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6");
    headers.append("content-type", "application/json");
    headers.append("origin", "https://www.pikkro.com");
    headers.append("priority", "u=1, i");
    headers.append("referer", "https://www.pikkro.com/");
    headers.append("sec-ch-ua", "\"Chromium\";v=\"134\", \"Not:A-Brand\";v=\"24\", \"Google Chrome\";v=\"134\"");
    headers.append("sec-ch-ua-mobile", "?0");
    headers.append("sec-ch-ua-platform", "\"macOS\"");
    headers.append("sec-fetch-dest", "empty");
    headers.append("sec-fetch-mode", "cors");
    headers.append("sec-fetch-site", "cross-site");
    headers.append("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36");
    return headers;
  }

  async login(phone: string, password: string): Promise<LoginResponse> {
    const requestBody: LoginRequest = {
      phone,
      password
    };

    const requestOptions = {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(requestBody),
      redirect: "follow" as RequestRedirect
    };

    const response = await fetch(`${this.baseURL}/users/login`, requestOptions);
    
    if (!response.ok) {
      throw new Error(`Login failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  }

  async loginWithEmailOrPhone(identifier: string, password: string): Promise<LoginResponse> {
    // Validate if identifier is email or phone
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const isPhone = /^[0-9]{10,15}$/.test(identifier.replace(/\D/g, ''));

    if (!isEmail && !isPhone) {
      throw new Error('Please enter a valid email address or phone number');
    }

    const requestBody: LoginRequest = {
      phone: identifier, // API expects phone field, but we can pass email or phone
      password
    };

    const requestOptions = {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(requestBody),
      redirect: "follow" as RequestRedirect
    };

    const response = await fetch(`${this.baseURL}/users/login`, requestOptions);
    
    if (!response.ok) {
      throw new Error(`Login failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    // Check if user is admin
    if (!result.isAdmin) {
      throw new Error('Access denied. Admin privileges required.');
    }

    return result;
  }
}

export default new AuthService(); 