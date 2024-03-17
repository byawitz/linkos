export default class NetworkHelper {
  static readonly login = '/login';
  static readonly whoAmI = '/whoami';
  static readonly server = '/server';
  static readonly links = '/links/';
  static readonly linkStats = '/links/stat/';

  static readonly updateProfile = '/user/update';

  public static async get(url: string) {
    try {
      const res = await fetch(NetworkHelper.baseUrl(url), { credentials: 'include' });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  }

  public static async post(url: string, body: Record<string, any> = {}) {
    return this.withBody(url, body, 'POST');
  }

  public static async patch(url: string, body: Record<string, any> = {}) {
    return this.withBody(url, body, 'PATCH');
  }

  public static async delete(url: string, body: Record<string, any> = {}) {
    return this.withBody(url, body, 'DELETE');
  }

  public static async withBody(url: string, body: Record<string, any>, method = 'post') {
    try {
      const res = await fetch(NetworkHelper.baseUrl(url), {
        method,
        body: JSON.stringify(body),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json;' }
      });

      return await res.json();
    } catch (e) {
      return { success: false };
    }
  }

  public static isURL(url: string) {
    return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(url);
  }

  public static baseUrl(appendUrl = '') {
    const base = import.meta.env.MODE === 'development' ? 'http://localhost:8081/v1/api' : `${window.location.origin}/v1/api`;
    return `${base}${appendUrl}`;
  }
}
