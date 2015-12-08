class Paginator {
    constructor(model) {
        this.model = model;

        this.count = 'count';
        this.object_list = 'results';
        this.paginate_by = 'paginate_by';
        this.next = 'next';
        this.previous = 'previous';
    }

    paginated(content) {
        this._content = content;
        let rawObjects = content[this.object_list];
        let objs = rawObjects.map(raw => new this.model(raw));
        objs.paginator = this;
        return objs;
    }
}


export default Paginator;
