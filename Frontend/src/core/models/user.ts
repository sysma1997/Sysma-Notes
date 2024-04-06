export class User {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly phone: string,
        readonly email: string
    ) { }

    public setId(id: string): User {
        return new User(id, this.name, this.phone, this.email);
    }
    public setName(name: string): User {
        return new User(this.id, name, this.phone, this.email);
    }
    public setPhone(phone: string): User {
        return new User(this.id, this.name, phone, this.email);
    }
    public setEmail(email: string): User {
        return new User(this.id, this.name, this.phone, email);
    }

    public toMap(): { id: string, name: string, phone: string, email: string } {
        return {
            id: this.id,
            name: this.name,
            phone: this.phone,
            email: this.email
        };
    }
    public toString(): string {
        return JSON.stringify(this.toMap());
    }
}