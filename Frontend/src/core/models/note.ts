export class Note {
    constructor(
        readonly id: string,
        readonly title: string,
        readonly description: string,
        readonly date: Date
    ) { }

    public setId(id: string): Note {
        return new Note(id, this.title, this.description, this.date);
    }
    public setTitle(title: string): Note {
        return new Note(this.id, title, this.description, this.date);
    }
    public setDescription(description: string): Note {
        return new Note(this.id, this.title, this.description, this.date);
    }
    public setDate(date: Date): Note {
        return new Note(this.id, this.title, this.description, date);
    }

    public toMap(): { id: string, title: string, description: string, date: Date } {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            date: this.date
        };
    }
    public toString(): string {
        return JSON.stringify(this.toMap());
    }
}