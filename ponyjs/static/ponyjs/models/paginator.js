class Paginator {
    constructor(model) {
        this.model = model;
        this.page_range = [];

        this.options = {
            count: 'count',
            object_list: 'results',
            paginate_by: 'paginate_by',
            next: 'next',
            previous: 'previous'
        }
    }

    paginated(content) {
        this._content = content;

        for (let key in this.options) {
            this[key] = content[this.options[key]];
        }

        if (this.object_list.length > 0) {
            let n = Math.ceil(this.count / this.paginate_by);
            for (let i=1; i<=n; i++) {
                this.page_range.push(i);
            }
        }

        // map to model instances
        let objs = this.object_list.map(raw => new this.model(raw));
        // tack the paginator on top so that it's available in the template
        objs.paginator = this;
        return objs;
    }
}


export default Paginator;
