export default class State {
  private _loading: boolean;
  private _error: boolean;
  private _success: boolean;
  public progress = 0;

  public get isLoading(): boolean { return this._loading }
  public loading(): void {
    this.reset()
    this._loading = true
  }

  public get isError(): boolean { return this._error }
  public error(): void {
    this.reset()
    this._error = true
  }

  public get isSuccess(): boolean { return this._success }
  public success(): void {
    this.reset()
    this._success = true
  }

  public setState(val: boolean): void {
    val ? this.success() : this.error()
  }

  public reset(): void {
    this._loading = false
    this._error = false
    this._success = false
    this.progress = 0
  }

  public constructor() {
    this._loading = false
    this._error = false
    this._success = false
  }
}