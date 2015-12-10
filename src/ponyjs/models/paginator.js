class InvalidPage extends Error {}


class EmptyPage extends InvalidPage {}


class Page {
    constructor(object_list, number, paginator) {
        this.object_list = object_list;
        this.number = number;
        this.paginator = paginator;
    }

    get length() {
        return this.object_list.length;
    }

    toString() {
        return `<Page ${this.number} of ${this.paginator.num_pages}`;
    }

    hasNext() {
        return this.number < this.paginator.num_pages;
    }

    hasPrevious() {
        return this.number > 1;
    }

    hasOtherPages() {
        return this.hasNext() || this.hasPrevious();
    }

    nextPageNumber() {
        let nr = this.paginator.page_range[this.number];
        if (nr !== undefined) {
            return nr;
        }
        throw new EmptyPage(`Page ${nr+1} does not exist`);
    }

    previousPageNumber() {
        let nr = this.paginator.page_range[this.number-1];
        if (nr !== undefined) {
            return nr;
        }
        throw new EmptyPage(`Page ${nr} does not exist`);
    }
}


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

    get num_pages() {
        return this.page_range.length;
    }

    page(page_nr) {
        let i = this.page_range.indexOf(page_nr);
        if (i === undefined) {
            throw new InvalidPage(`page number ${page_nr} does not exist`);
        }
        // TODO: figure out which pages belong to which object list
        return new Page(this.object_list, page_nr, this);
    }
}


export default Paginator;
