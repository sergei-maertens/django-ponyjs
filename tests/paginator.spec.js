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

        expect(page.toString()).to.equal('<Page 1 of 3>');
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

    it('should correctly report hasOtherPages', () => {
        let paginator = new Paginator(Pizza);

        let content = {
            paginate_by: 1,
            results: [{id: 2}],
            count: 3
        };

        paginator.paginated(content);
        let page1 = paginator.page(1);
        let page2 = paginator.page(2);
        let page3 = paginator.page(3);

        expect(page3.hasPrevious()).to.be.true;
        expect(page3.hasNext()).to.be.false;
        expect(page3.hasOtherPages()).to.be.true;
        expect(page2.hasOtherPages()).to.be.true;
        expect(page2.hasOtherPages()).to.be.true;

        let content2 = {
            paginate_by: 1,
            results: [{id: 1}],
            count: 1
        };
        paginator2 = new Paginator(Pizza);
        paginator2.paginated(content2);
        let page21 = paginator2.page(1);
        expect(page21.hasOtherPages()).to.be.false;
    });

    it('should throw for out of range pages', () => {
        let paginator = new Paginator(Pizza);
        let content = {
            paginate_by: 1,
            results: [{id: 1}],
            count: 1
        };
        paginator.paginated(content);
        let page = paginator.page(1);
        expect(() => page.nextPageNumber()).to.throw(EmptyPage);
        expect(() => page.previousPageNumber()).to.throw(EmptyPage);
    });

    it('should have an empty page range for zero results', () => {
        let paginator = new Paginator(Pizza);
        let content = {
            paginate_by: 1,
            results: [],
            count: 0
        };
        paginator.paginated(content);
        expect(paginator.page_range).to.deep.equal([]);
    });

});
