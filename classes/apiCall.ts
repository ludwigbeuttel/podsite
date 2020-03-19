import axios, { AxiosResponse, AxiosRequestConfig } from "axios"
import State from "./state"

export default class ApiCall extends State {
  public cancel(): void {
    this.source.cancel()
    this.reset()
  }

  private cancelToken = axios.CancelToken;
  private source = this.cancelToken.source();

  public async exec(axiosConfig: AxiosRequestConfig): Promise<any> {
    this.loading()

    this.source.cancel()
    this.source = this.cancelToken.source()

    axiosConfig.cancelToken = this.source.token

    try {
      const data = await axios(axiosConfig)
        .then((res: AxiosResponse) => res.data)
        .catch(() => [])
      this.success()
      return data
    } catch (err) {
      this.error()
      throw new Error(err)
    }
  }

  public async get(data: AxiosRequestConfig | string): Promise<any> {
    const axiosConfig: AxiosRequestConfig = typeof data === "string" ? { url: data } : data
    axiosConfig.method = "get"
    try {
      return await this.exec(axiosConfig)
    } catch (err) {
      throw new Error(err)
    }
  }

  public async post(data: AxiosRequestConfig | string): Promise<any> {
    const axiosConfig: AxiosRequestConfig = typeof data === "string" ? { url: data } : data
    axiosConfig.method = "post"
    axiosConfig.onUploadProgress = (e: ProgressEvent) => {
      this.progress = Math.round((e.loaded * 100) / e.total)
    }

    try {
      return await this.exec(axiosConfig)
    } catch (err) {
      throw new Error(err)
    } finally {
      this.progress = 0
    }
  }

  public async put(data: AxiosRequestConfig | string): Promise<any> {
    const axiosConfig: AxiosRequestConfig = typeof data === "string" ? { url: data } : data
    axiosConfig.method = "put"
    try {
      return await this.exec(axiosConfig)
    } catch (err) {
      throw new Error(err)
    }
  }

  public async delete(data: AxiosRequestConfig | string): Promise<any> {
    const axiosConfig: AxiosRequestConfig = typeof data === "string" ? { url: data } : data
    axiosConfig.method = "delete"
    try {
      return await this.exec(axiosConfig)
    } catch (err) {
      throw new Error(err)
    }
  }
}