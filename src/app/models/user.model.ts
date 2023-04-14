export class User {
  constructor(
    public name: string,
    public surname: string,
    public age: string | number,
    public email: string,
    public id?: string,
    public access_token?: string,
    public refresh_token?: string
  ) {}
}
