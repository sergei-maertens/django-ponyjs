import { Model } from 'ponyjs/models.js';
import { Page, Paginator, InvalidPage, EmptyPage } from 'ponyjs/models/paginator.js';


let Pizza = Model('Pizza');


describe('Paginators', () => {

    it('should paginate a response', () => {
        let content = {
            paginate_by: 1,
            next: null,
            previous: null,
            results: [{id: 1}],
            count: 3
        };

        let paginator = new Paginator(Pizza);
        expect(paginator.page_range).to.deep.equal([]);
        let objs = paginator.paginated(content);

        expect(paginator.page_range).to.deep.equal([1, 2, 3]);
        expect(objs[0]).to.be.instanceof(Pizza);
        expect(paginator.num_pages).to.equal(3);

        // test the Page class
        let page = paginator.page(1);
        expect(page.paginator).to.equal(paginator);
        expect(page.number).to.equal(1);
        expect(page).to.be.instanceof(Page);
        expect(page.length).to.equal(1);
        expect(page.hasNext()).to.be.true;
        expect(page.hasPrevious()).to.be.false;
        expect(page.hasOtherPages()).to.be.true;
        expect(page.nextPageNumber()).to.equal(2);
    });

    it('should throw for invalid pages', () => {
        let paginator = new Paginator(Pizza);

        // not paginated yet, should throw
        expect(() => paginator.page(1)).to.throw(InvalidPage);


        // paginate, check previous/next
        let content = {
            paginate_by: 2,
            results: [{id: 3}, {id: 4}],
            count: 5 // 3 pages
        };
        paginator.paginated(content);
        let page = paginator.page(2);

        expect(page.hasPrevious()).to.be.true;
        expect(page.previousPageNumber()).to.equal(1);
        expect(page.hasNext()).to.be.true;
        expect(page.nextPageNumber()).to.equal(3);

        expect(() => paginator.page(0)).to.throw(InvalidPage);
        expect(() => paginator.page(4)).to.throw(InvalidPage);
    });

});
