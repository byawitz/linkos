export default class NetworkHelper {
  static readonly whoAmI = '/whoami';
  static readonly addLink = '/links/add';
  static readonly getLinks = '/links/';
  static readonly getLink = '/links/get/:id';
  static readonly updateLink = '/links/update/:id';
  static readonly deleteLink = '/links/delete/:id';

  public static async get(url: string) {
    try {
      const res = await fetch(NetworkHelper.baseUrl(url));
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  }

  public static async post(url: string, body: Record<string, any>) {
    try {
      const res = await fetch(NetworkHelper.baseUrl(url), {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json;'
        }
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
